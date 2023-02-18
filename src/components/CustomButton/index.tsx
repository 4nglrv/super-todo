import './style.css'
import RollingIcon from '../Svg/Rolling'
import PlusIcon from '../Svg/Plus'

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
  isLoading?: boolean,
  isDisabled?: boolean,
  icon?: 'plus',
  children?: React.ReactNode
}

export default function CustomButton({ children, ...props }: Props) {
  return (
    <button
      onClick={props.onClick}
      className={`custom-button ${props.className}`}
      disabled={props.isLoading || props.isDisabled}
    >
      <div className='custom-button-container'>
        <div className={`custom-button-content ${props.isLoading ? 'loading' : ''}`}>
          {children}
          {props.icon ? Icon(props.icon) : null}
        </div>
        { props.isLoading ? <RollingIcon className="rolling-btn active" /> : null }
      </div>
    </button>
  )
}