import './style.css'
import RollingIcon from '../Svg/Rolling'
import PlusIcon from '../Svg/Plus'
import classNames from 'classnames'

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
  isloading?: any,
  isdisabled?: any,
  icon?: 'plus',
  children?: React.ReactNode
}

export default function CustomButton({ children, ...props }: Props) {
  return (
    <button
      {...props}
      onClick={props.onClick}
      className={`custom-button ${props.className}`}
      disabled={props.isloading || props.isdisabled}
    >
      <div className='custom-button-container'>
        <div className={classNames('custom-button-content', {
          'loading': props.isloading
        })}>
          {children}
          {props.icon ? Icon(props.icon) : null}
        </div>
        { props.isloading ? <RollingIcon className="rolling-btn active" /> : null }
      </div>
    </button>
  )
}