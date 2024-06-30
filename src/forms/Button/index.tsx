import { ButtonHTMLAttributes } from "react";

const Button = ({children, ...rest}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button type="button" {...rest}>{children}</button>
  )
}

export default Button;