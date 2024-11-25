import React from 'react'
import style from './footer.module.css'
import cord from '../../Assets/Images/cord.png'
import headset from '../../Assets/Images/headset.png'
import email from '../../Assets/Images/email.png'
import localphone from '../../Assets/Images/localphone.png'

export default function Footer() {
    return (
        <>
            <footer className={style.footer}>
                <div className={style.view}>
                    <h3>
                        Want to know more about us?
                    </h3>
                    <div>
                        <div className={style.details}>
                            <img src={headset} alt='smart-cord' />
                            <p>Contact Us</p>
                        </div>
                        <div className={style.details}>
                            <img src={email} alt='smart-cord' />
                            <p>Email: hello@trovestfinance.com</p>
                        </div>
                        <div className={style.details}>
                            <img src={localphone} alt='smart-cord' />
                            <p>Helpline: +234 816 606 4166</p>
                        </div>
                    </div>
                </div>
                <div className={style.view}>
                    <img src={cord} alt='smart-cord' />
                </div>
                <div className={style.copyright}>
                <p>© {new Date().getFullYear()} Trovest Limited. All rights reserved.</p>
            </div>
            {/* <div className={style.copyright}>
                <p>Powered By Phrite Tech & Flowth Soltn Hub © {new Date().getFullYear()}. All rights reserved.</p>
            </div> */}
            </footer>
        </>
    )
}
