import React from "react";
import { Card, Typography, Button, Tag, Space } from "antd";
import { EditOutlined, EyeInvisibleOutlined, DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import moment from 'moment'
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

export default function JobCard({
  title,
  location,
  postedDate,
  isActive,
  applicantsCount,
  onEdit,
  onUnlist,
  onDelete,
  jobId
}) {
  const navigate = useNavigate()
  return (
    <Card
      className="w-80 shadow-md hover:shadow-lg transition-shadow duration-300 relative"
      actions={[
        <Button type="text" icon={<EditOutlined />} onClick={onEdit} key="edit">
          Edit
        </Button>,
        <Button type="text" icon={<EyeInvisibleOutlined />} onClick={onUnlist} key="unlist">
          Unlist
        </Button>,
        <Button type="text" icon={<DeleteOutlined />} onClick={onDelete} key="delete" danger>
          Delete
        </Button>,
      ]}
    >
      <Space direction="vertical" size="small" className="w-full">
        <div className="flex justify-between items-center">
          {/* Company Name */}
          {/* <Text type="secondary">{company}</Text> */}
          {/* Posted on Date */}
          <Text type="secondary" className="text-xs">
          Posted on: {moment(postedDate).format("MMMM Do, YYYY")}
          </Text>
        </div>

        <Title level={4} className="mb-0">
          {title}
        </Title>
        <Text>{location}</Text>
        <Space className="w-full justify-between">
          <Text type="secondary">Location: {location}</Text>
          <Tag color={isActive ? "red" : "green"} >{isActive ? "Inactive" : "Active"}</Tag>
        </Space>
        <Button
          type="default"
          icon={<TeamOutlined />}
          onClick={() => navigate(`/employer/applicants/${jobId}`)}
          className="flex items-center"
        >
          Applicants ( { applicantsCount } )
        </Button>
      </Space>
    </Card>
  );
}
