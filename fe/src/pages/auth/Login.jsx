import { Form, Input, Button, Row, Col, Card, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, setAuth } from '../../slices/authSlice'

const LoginPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const dispatch = useDispatch() // Khởi tạo hook useNavigate
  // Hàm xử lý submit form
  const onFinish = async () => {
    try {
      const values = await form.validateFields()

      const payload = {
        ...values,
        onSuccess: () => {
          dispatch(setAuth(true))
          notification.success({
            message: 'login success!'
          })
          navigate('/')
        }
      }

      dispatch(login(payload))
    } catch (info) {
      console.log('Validate Failed:', info)
    }
  }
  const handleClickRedirect = () => {
    navigate('/register')
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title='Login' style={{ width: 300 }}>
        <Form name='login' initialValues={{ remember: true }} onFinish={onFinish} layout='vertical' form={form}>
          {/* Tên đăng nhập */}
          <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder='Username' />
          </Form.Item>
          {/* Mật khẩu */}
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder='Password' />
          </Form.Item>

          {/* Nút đăng nhập */}
          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              Log in
            </Button>
          </Form.Item>
        </Form>

        {/* Link đăng ký */}
        <Row justify='end'>
          <Col>
            <Button onClick={handleClickRedirect}> Don&apos;t have an account? Register now</Button>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default LoginPage
