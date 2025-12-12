/** @jsxImportSource @emotion/react */
import React from "react"
import { Link } from "react-router-dom"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  to?: string
  external?: boolean
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  style,
  to,
  external = false,
  ...props
}) => {
  const imgElement = (
    <img
      src={src}
      alt={alt}
      className={`${className || ""}`.trim()}
      style={style}
      loading="lazy"
      {...props}
    />
  )

  if (to) {
    if (external) {
      return (
        <a href={to} rel="noreferrer" target="_blank">
          {imgElement}
        </a>
      )
    } else {
      return (
        <Link to={to}>
          {imgElement}
        </Link>
      )
    }
  }

  return imgElement
}

export default Image
