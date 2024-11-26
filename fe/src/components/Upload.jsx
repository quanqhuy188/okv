import { useState } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axiosClient from '../lib/axiosClient'

// eslint-disable-next-line react/prop-types
const ImageUpload = ({ onImageUpload }) => {
  const [fileList, setFileList] = useState([])

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axiosClient.post('api/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        requiresAuth: true
      })
      console.log(response)
      onSuccess('ok')
      message.success('Image uploaded successfully!')
      onImageUpload(response.fileUrl)
      console.log('Uploaded file URL:', response.fileUrl)
    } catch (error) {
      onError(error)
    }
  }

  return (
    <Upload
      customRequest={handleUpload}
      listType='picture'
      fileList={fileList}
      onChange={({ fileList }) => setFileList(fileList)}
      maxCount={1}
    >
      <Button icon={<UploadOutlined />}>Upload Image</Button>
    </Upload>
  )
}

export default ImageUpload
