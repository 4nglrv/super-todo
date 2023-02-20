import './style.css'
import classNames from 'classnames'

import PlusIcon from '../Svg/Plus'
import RollingIcon from '../Svg/Rolling'

function Icon(icon: 'plus') {
  switch (icon) {
    case 'plus':
      return <PlusIcon/>
    default: return null
  }
}

interface Props {
  onClick?: () => void,
  className?: string,
  isloading?: boolean,
  isdisabled?: boolean,
  icon?: 'plus',
  children?: React.ReactNode
}

const CustomButton = ({ children, isloading, isdisabled, ...props }: Props) => {
  return (
    <button
      {...props}
      onClick={props.onClick}
      className={`custom-button ${props.className}`}
      disabled={isloading || isdisabled}
    >
      <div className='custom-button-container'>
        <div className={classNames('custom-button-content', {
          'loading': isloading
        })}>
          {children}
          {props.icon ? Icon(props.icon) : null}
        </div>
        { isloading ? <RollingIcon className="rolling-btn active" /> : null }
      </div>
    </button>
  )
}

export default CustomButton