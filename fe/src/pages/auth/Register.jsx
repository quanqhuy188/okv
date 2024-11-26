import { Form, Input, Button, Row, Col, Card, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { setAuth, register } from '../../slices/authSlice'

import { useNavigate } from 'react-router-dom'
const RegisterPage = () => {
  const navigate = useNavigate() 
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const onFinish = async () => {
    try {
      const values = await form.validateFields()

      const payload = {
        ...values,
        onSuccess: () => {
          dispatch(setAuth(true))
          notification.success({
            message: 'Register success!'
          })
          navigate('/home')
        }
      }

      dispatch(register(payload))
    } catch (info) {
      console.log('Validate Failed:', info)
    }
  }
  const handleClickRedirect = () => {
    navigate('/login')
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title='Register' style={{ width: 300 }}>
        <Form name='register' initialValues={{ remember: true }} onFinish={onFinish} layout='vertical' form={form}>
          <Form.Item name='fullname' rules={[{ required: true, message: 'Please input your fullname!' }]}>
            <Input prefix={<UserOutlined />} placeholder='Fullname' />
          </Form.Item>
          <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder='Username' />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters.' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Password' />
          </Form.Item>
          <Form.Item
            name='confirmPassword'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject('The two passwords that you entered do not match!')
                }
              })
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Confirm Password' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <Row justify='end'>
          <Col>
            <Button onClick={handleClickRedirect}>Already have an account? Login</Button>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default RegisterPage
