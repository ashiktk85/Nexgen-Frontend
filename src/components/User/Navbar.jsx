import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Bell, Trash2, Briefcase, Home, BookOpen, User, LogOut } from "lucide-react";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { toast } from "sonner";
import { getSocket, disconnectSocket } from "@/utils/socket";
import TechpathBrand, { BRAND_SIZES, BRAND_BLUE } from "@/components/TechpathBrand";

/* ─── Inline global styles ─── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .navbar-root * { box-sizing: border-box; }
  .navbar-root { font-family: 'DM Sans', sans-serif; }

  .nav-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
    text-decoration: none;
    white-space: nowrap;
  }
  .nav-link:hover { background: rgba(255,255,255,0.12); }
  .nav-link.on-hero:hover { background: rgba(255,255,255,0.12); }
  .nav-link.on-white:hover { background: #f1f5f9; color: #4f46e5 !important; }
  .nav-link.active-light {
    background: #eef2ff;
    color: #4f46e5 !important;
    font-weight: 600;
  }

  .bell-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.18s ease;
    flex-shrink: 0;
  }
  .bell-btn:hover { transform: scale(1.07); }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.18s ease;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .notif-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s;
    border: 1px solid transparent;
  }
  .notif-item:hover { background: #f8fafc; border-color: #e2e8f0; }
  .notif-item.unread { background: #eef2ff; border-color: #e0e7ff; }
  .notif-item.unread:hover { background: #e0e7ff; }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    color: #1e293b;
  }
  .mobile-link:hover { background: #f1f5f9; color: #4f46e5; }
  .mobile-link.mobile-logout:hover { background: #fef2f2; color: #ef4444; }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  .notif-panel { animation: slideDown 0.22s ease forwards; }

  @keyframes mobileSlide {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mobile-menu { animation: mobileSlide 0.22s ease forwards; }

  .badge {
    position: absolute;
    top: -3px;
    right: -3px;
    min-width: 17px;
    height: 17px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
`;

const Navbar = () => {
  const user = useSelector((state) => state.user.seekerInfo);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const notificationRef = useRef(null);
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isLoggedIn = user && Object.keys(user).length > 0;

  /* ── Scroll shadow — rAF-throttled, no backdrop-blur (avoids scroll jank) ── */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchNotifications = async () => {
    if (!user?.userId) return;
    try {
      const response = await userAxiosInstance.get(`/notifications/${user.userId}`);
      setNotifications(response.data.notifications || []);
      setNotificationCount(response.data.unreadCount || 0);
    } catch (error) {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    if (!user?.userId) return;

    const socket = getSocket();
    if (!socket) return;

    fetchNotifications();
    socket.connect();
    socket.emit("register", user.userId);

    const onNotification = (data) => {
      toast.info(data.message || "New notification received!");
      fetchNotifications();
    };

    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
      disconnectSocket();
    };
  }, [user?.userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        notificationRef.current && !notificationRef.current.contains(event.target) &&
        bellRef.current && !bellRef.current.contains(event.target)
      ) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    try {
      await userAxiosInstance.post("/logout");
    } catch {
      // Still clear local session even if the server logout fails
    } finally {
      authLogout();
      toast.success("Logged out successfully");
      disconnectSocket();
      setNotifications([]);
      setNotificationCount(0);
      navigate("/login");
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const markAsRead = async (id) => {
    try {
      await userAxiosInstance.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch { toast.error("Failed to update notification"); }
  };

  const deleteNotification = async (id) => {
    try {
      await userAxiosInstance.delete(`/notifications/${id}`);
      fetchNotifications();
      toast.success("Notification deleted");
    } catch { toast.error("Failed to delete notification"); }
  };

  /* ── Active route helper ── */
  const isActive = (path) => location.pathname === path;

  /* ── Nav background logic ── */
  const onHero = isHomePage && !scrolled;
  const solidNav = !onHero || mobileMenuOpen || showNotifications;

  const navBg = solidNav ? "rgba(255, 255, 255, 0.98)" : "transparent";
  const navBorder = solidNav ? "1px solid #e8edf5" : "none";
  const navShadow = solidNav ? "0 4px 24px rgba(0,0,0,0.06)" : "none";

  const linkColor = solidNav ? "#475569" : "#e2e8f0";

  return (
    <>
      <style>{globalStyle}</style>
      <nav
        className="navbar-root w-full max-w-[100vw] overflow-x-hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          borderBottom: navBorder,
          boxShadow: navShadow,
          transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          padding: "0 12px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            minWidth: 0,
            gap: 8,
          }}
        >
          {/* ── Logo ── */}
          <div
            onClick={() => navigate("/")}
            className="navbar-logo-wrap"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              userSelect: "none",
              minWidth: 0,
              flexShrink: 1,
            }}
          >
            <TechpathBrand {...BRAND_SIZES.nav} showIcon textColor={BRAND_BLUE} />
          </div>

          {/* ── Desktop Nav ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
            className="desktop-nav"
          >
            {/* Nav Links */}
            {[
              { label: "Home", path: "/", icon: <Home size={14} /> },
              { label: "Browse Jobs", path: "/all-jobs", icon: <Briefcase size={14} /> },
              ...(isLoggedIn ? [{ label: "My Jobs", path: "/job-application-history", icon: <BookOpen size={14} /> }] : []),
            ].map(({ label, path, icon }) => (
              <span
                key={path}
                className={`nav-link ${solidNav ? "on-white" : "on-hero"} ${solidNav && isActive(path) ? "active-light" : ""}`}
                style={{ color: isActive(path) && solidNav ? "#4f46e5" : !solidNav && isActive(path) ? "#ffffff" : linkColor }}
                onClick={() => navigate(path)}
              >
                {icon}
                {label}
              </span>
            ))}

            {/* Profile / Login */}
            <span
              className={`nav-link ${solidNav ? "on-white" : "on-hero"} ${solidNav && isActive(isLoggedIn ? "/profile" : "/login") ? "active-light" : ""}`}
              style={{ color: !solidNav && isActive(isLoggedIn ? "/profile" : "/login") ? "#ffffff" : linkColor }}
              onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
            >
              <User size={14} />
              {isLoggedIn ? "Profile" : "Login / Sign Up"}
            </span>

            {/* Divider */}
            {isLoggedIn && (
              <div
                style={{
                  width: 1,
                  height: 22,
                  background: solidNav ? "#e2e8f0" : "rgba(255,255,255,0.18)",
                  margin: "0 6px",
                }}
              />
            )}

            {/* Bell */}
            {isLoggedIn && (
              <div style={{ position: "relative" }} ref={bellRef}>
                <button
                  className="bell-btn"
                  onClick={handleNotificationClick}
                  style={{
                    background: solidNav ? "#f1f5f9" : "rgba(255,255,255,0.1)",
                    color: linkColor,
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                  {notificationCount > 0 && (
                    <span className="badge">{notificationCount}</span>
                  )}
                </button>
              </div>
            )}

            {/* Logout */}
            {isLoggedIn && (
              <button
                className="logout-btn"
                onClick={handleLogout}
                style={{
                  background: solidNav ? "#fef2f2" : "rgba(239,68,68,0.15)",
                  color: solidNav ? "#ef4444" : "#fca5a5",
                  marginLeft: 4,
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            )}
          </div>

          {/* ── Mobile Right ── */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
            className="mobile-right"
          >
            {isLoggedIn && (
              <div style={{ position: "relative" }} ref={bellRef}>
                <button
                  className="bell-btn"
                  onClick={handleNotificationClick}
                  style={{
                    background: solidNav ? "#f1f5f9" : "rgba(255,255,255,0.1)",
                    color: linkColor,
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                  {notificationCount > 0 && (
                    <span className="badge">{notificationCount}</span>
                  )}
                </button>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: solidNav ? "#f1f5f9" : "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 10,
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: linkColor,
                transition: "all 0.15s",
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Notification Panel ── */}
        {showNotifications && user?.userId && (
          <div
            ref={notificationRef}
            className="notif-panel"
            style={{
              position: "fixed",
              top: 72,
              right: 16,
              width: 360,
              maxWidth: "calc(100vw - 32px)",
              maxHeight: "70vh",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 12px 48px rgba(0,0,0,0.14)",
              border: "1.5px solid #e0e7ff",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              zIndex: 200,
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "16px 18px 14px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, #312e81, #4f46e5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={16} color="#a5b4fc" />
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#fff",
                  }}
                >
                  Notifications
                </span>
                {notificationCount > 0 && (
                  <span
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {notificationCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 7,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#c7d2fe",
                  transition: "all 0.15s",
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Notification list */}
            <div style={{ overflowY: "auto", padding: "12px" }}>
              {notifications.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "36px 16px",
                    color: "#94a3b8",
                  }}
                >
                  <Bell size={36} style={{ marginBottom: 10, opacity: 0.3 }} />
                  <p style={{ fontSize: 14, margin: 0 }}>You're all caught up!</p>
                  <p style={{ fontSize: 12, margin: "4px 0 0", color: "#cbd5e1" }}>No new notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notif-item ${!n.read ? "unread" : ""}`}
                    onClick={() => markAsRead(n._id)}
                    style={{ marginBottom: 6 }}
                  >
                    {/* Dot */}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: n.read ? "#cbd5e1" : "#6366f1",
                        flexShrink: 0,
                        marginTop: 5,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13.5,
                          color: "#1e293b",
                          margin: 0,
                          fontWeight: n.read ? 400 : 600,
                          lineHeight: 1.45,
                        }}
                      >
                        {n.message}
                      </p>
                      <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "4px 0 0" }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#cbd5e1",
                        padding: 4,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        transition: "color 0.15s",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}
                      aria-label="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu"
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1.5px solid #e8edf5",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              padding: "10px",
              margin: "0 0 12px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {[
              { label: "Home", path: "/", icon: <Home size={16} /> },
              { label: "Browse Jobs", path: "/all-jobs", icon: <Briefcase size={16} /> },
              ...(isLoggedIn ? [{ label: "My Jobs", path: "/job-application-history", icon: <BookOpen size={16} /> }] : []),
            ].map(({ label, path, icon }) => (
              <div
                key={path}
                className="mobile-link"
                style={isActive(path) ? { background: "#eef2ff", color: "#4f46e5" } : {}}
                onClick={() => { setMobileMenuOpen(false); navigate(path); }}
              >
                {icon}
                {label}
              </div>
            ))}

            <div
              className="mobile-link"
              onClick={() => { setMobileMenuOpen(false); navigate(isLoggedIn ? "/profile" : "/login"); }}
            >
              <User size={16} />
              {isLoggedIn ? "Profile" : "Login / Sign Up"}
            </div>

            {isLoggedIn && (
              <>
                <div
                  style={{ height: 1, background: "#f1f5f9", margin: "4px 6px" }}
                />
                <div
                  className="mobile-link mobile-logout"
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  style={{ color: "#ef4444" }}
                >
                  <LogOut size={16} />
                  Logout
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-right { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-right { display: flex !important; }
          .navbar-logo-wrap img,
          .navbar-logo-wrap svg {
            height: 40px !important;
            width: auto !important;
          }
          .navbar-logo-wrap span {
            font-size: 22px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;