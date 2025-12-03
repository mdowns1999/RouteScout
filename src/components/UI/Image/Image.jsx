/** @jsxImportSource @emotion/react */
import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

const Image = ({
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
        <a href={to} {...props} rel="noreferrer" target="_blank">
          {imgElement}
        </a>
      )
    } else {
      return (
        <Link to={to} {...props}>
          {imgElement}
        </Link>
      )
    }
  }

  return imgElement
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  to: PropTypes.string,
}

export default Image
