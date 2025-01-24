import React from "react"
import { Card, Typography, Button, Tag, Space } from "antd"
import { EditOutlined, EyeInvisibleOutlined, DeleteOutlined } from "@ant-design/icons"

const { Text, Title } = Typography

export default function JobCard({
  title,
  company,
  location,
  postedDate,
  isActive,
  onEdit,
  onUnlist,
  onDelete,
}) {
  return (
    <Card
      className="w-80 shadow-md hover:shadow-lg transition-shadow duration-300"
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
        <Title level={4} className="mb-0">
          {title}
        </Title>
        <Text type="secondary">{company}</Text>
        <Text>{location}</Text>
        <Space className="w-full justify-between">
          <Text type="secondary">Posted: {postedDate}</Text>
          <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
        </Space>
      </Space>
    </Card>
  )
}

