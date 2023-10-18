import classNames from 'classnames'
import { ReactNode } from 'react'

function Card({ className, children }: { children: ReactNode; className?: string }) {
  return <div className={classNames('rounded-lg border border-gray-200', className)}>{children}</div>
}

export default Card
