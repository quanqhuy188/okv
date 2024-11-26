import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { create, get } from '../slices/productSlice'
import ImageUpload from '../components/Upload'
import { Link } from 'react-router-dom'

const ProductList = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.product)
  const { isAuth } = useSelector((state) => state.auth)
  const [dataSource, setDatasource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  console.log(products)

  useEffect(() => {
    if (products) {
      setDatasource(products.products)
    }
  }, [products])

  useEffect(() => {
    if (isAuth) {
      dispatch(get())
    }
  }, [dispatch, isAuth])

  const [imageUrl, setImageUrl] = useState('')

  const showAddProductModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleImageUpload = (url) => {
    setImageUrl(url)
    form.setFieldsValue({ imageUrl: url })
  }

  const handleAddProduct = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          ...values,
          userId: 'SDSDS'
        }
        dispatch(create(payload))
        form.resetFields()
        setIsModalOpen(false)
      })
      .catch((error) => {
        console.error('Validation Failed:', error)
      })
  }

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/product/${record.id}`}>{text}</Link>
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh sách sản phẩm</h1>
      <Button type='primary' onClick={showAddProductModal} style={{ marginBottom: '20px' }}>
        Thêm sản phẩm
      </Button>
      <Table dataSource={dataSource} columns={columns} />


      <Modal title='Thêm sản phẩm' visible={isModalOpen} onCancel={handleCancel} onOk={handleAddProduct}>
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Tên sản phẩm'
            name='name'
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='Hình ảnh' name='imageUrl' rules={[{ required: true, message: 'Vui lòng tải ảnh!' }]}>
            <Input value={imageUrl} disabled />
            <ImageUpload onImageUpload={handleImageUpload} />
          </Form.Item>
          <Form.Item
            label='Giá (VNĐ)'
            name='price'
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
          >
            <Input type='number' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductList
