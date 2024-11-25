import React from 'react'
import styles from './card.module.css'

export default function Card(props) {
    const { children } = props
    return (
        <div className={`${styles.card} ${props.styles}`} {...props}>
            {children}
        </div>
    )
}
