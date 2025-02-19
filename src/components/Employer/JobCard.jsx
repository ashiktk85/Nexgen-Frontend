import React from "react";
import { Card, Typography, Button, Tag, Space } from "antd";
import { EditOutlined, EyeInvisibleOutlined, DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import moment from 'moment'
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

export default function JobCard({
  job, onEdit, onDelete, onUnlist
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
          Posted on: {moment(job?.createdAt).format("MMMM Do, YYYY")}
          </Text>
        </div>

        <Title level={4} className="mb-0">
          {job?.jobTitle}
        </Title>
        <Text type="secondary">Experience: {job?.experienceRequired?.join(' - ')} yrs</Text>
        <Space className="w-full justify-between">
          <Text type="secondary">Location: {`${job?.city},${job?.country}`}</Text>
          <Tag color={job?.isBlocked ? "red" : "green"} >{job?.isBlocked ? "Inactive" : "Active"}</Tag>
        </Space>
        <Button
          type="default"
          icon={<TeamOutlined />}
          onClick={() => navigate(`/employer/applicants/${job?._id}`)}
          className="flex items-center"
        >
          Applicants ( { job?.applications?.length } )
        </Button>
      </Space>
    </Card>
  );
}
