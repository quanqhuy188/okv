// src/pages/Product.js

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getById } from '../slices/productSlice'
import CommentSection from '../components/CommentSection'

const Product = () => {
  const dispatch = useDispatch()
  const { id } = useParams() // Lấy ID từ URL
  const { product } = useSelector((state) => state.product)
  useEffect(() => {
    const payload = {
      id
    }

    dispatch(getById(payload))
  }, [dispatch, id])

  return (
    <div>
      <h1>Chi tiết sản phẩm</h1>
      <p>
        <strong>Tên sản phẩm:</strong> {product?.name}
      </p>
      <p>
        <strong>Giá (VNĐ):</strong> {product?.price}
      </p>
      <p>
        <strong>Số lượng:</strong> {product?.quantity}
      </p>
      <p>
        <strong>Mô tả:</strong> {product?.description}
      </p>

      <CommentSection productId={id} />
    </div>
  )
}

export default Product
