const UserTypePill = ({ role, isInstituteStudent }) => {
  const isStudent = role === "student" || isInstituteStudent === true;
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[56px] px-2 py-0.5 rounded-full text-[10px] font-bold border ${
        isStudent
          ? "bg-indigo-100 text-indigo-700 border-indigo-200"
          : "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {isStudent ? "Student" : "Public"}
    </span>
  );
};

export default UserTypePill;
