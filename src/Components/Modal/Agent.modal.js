import React, { useState } from 'react'
import agentStyles from './agent.modal.module.css'
import FormInput from '../Shared/FormInput/FormInput'
import { addAgentAction, setAgentAction } from '../../Reducers/agent.reducer'
import { useDispatch, useSelector } from 'react-redux'
import { adminCreateAgent, createSuperAdminAdmin } from '../../Sagas/Requests'
import { PasswordCheck, user_storage_token } from '../../config'
import Loader from './Loader'
import Compress from "react-image-file-resizer";
import DisplayMessage from '../Message'


export default function AgentModal(props) {
    const { setopenModal, auth, setloading, loading, getAgents, folder, usertype } = props
    const [imageFile, setimageFile] = useState('')
    const [profileImage, setprofileImage] = useState('')
    const [passwordType, setpasswordType] = useState(true)
    const [agentData, setagentData] = useState({
        image: '',
        first_name: '',
        last_name: '',
        mobile: '',
        gender: '',
        folder: usertype === 'admin' ? 'agent' : 'admin',
        email: usertype === 'admin' ? 'troves@email' : '',
        nin: '',
        password: '',
        state: '',
        lga: '',
        address: '',
    })

    const checkInput = () => {
        let valid = true
        if (agentData.first_name === '' || agentData.last_name === '' || agentData.mobile === '' || agentData.gender === '' || agentData.nin === '' || agentData.state === '' || agentData.lga === '' || agentData.address === '' || imageFile === '') {
            valid = false
        }
        if (agentData.password === '') {
            valid = false
        }
        return valid
    }

    function handleChange(e) {
        const file = e.target.files[0];
        Compress.imageFileResizer(
            file, // the file from input
            500, // width
            500, // height
            "PNG", // compress format WEBP, JPEG, PNG
            90, // quality
            0, // rotation
            (uri) => {
                setimageFile(URL.createObjectURL(uri));
                setprofileImage(uri);
                const image = {
                    name: 'admin-image',
                    uri: uri,
                    // uri: URL.createObjectURL(uri),
                    "type": "image/jpeg"
                }
                setagentData({
                    ...agentData, image: uri
                })
            },
            "blob"
        );
    }

    const createAgent = async (event) => {
        event.preventDefault()
        const valid = checkInput()
        if (valid === false) {
            DisplayMessage('Some fields are empty', 'warning')
        }
        else if (agentData.password) {
            if (agentData.password && agentData.password.length > 20) {
                DisplayMessage('Password should be 20 characters long', 'warning')
            }
            else {
                const password = await PasswordCheck(agentData.password)
                if (password === false) {
                    DisplayMessage('Password should contain upper case, lower casee, number and one special character', 'warning')
                }
                else {
                    const formData = new FormData()
                    formData.append('first_name', agentData.first_name)
                    formData.append('last_name', agentData.last_name)
                    formData.append('mobile', agentData.mobile)
                    formData.append('gender', agentData.gender)
                    formData.append('folder', agentData.folder)
                    formData.append('nin', agentData.nin)
                    formData.append('state', agentData.state)
                    formData.append('lga', agentData.lga)
                    formData.append('address', agentData.address)
                    formData.append('email', agentData.email)
                    formData.append('password', agentData.password)
                    // formData.append('image', agentData.image)
                    formData.append('image', profileImage)
                    setloading(true)
                    const response = usertype === 'admin' ? await adminCreateAgent(formData, localStorage.getItem(user_storage_token)) : await createSuperAdminAdmin(formData, localStorage.getItem(user_storage_token))
                    const { success, message } = response.data
                    if (success === false) {
                        setloading(false)
                        DisplayMessage(message, 'warning')
                    }
                    else {
                        setopenModal(false)
                        DisplayMessage(message, 'success')
                        getAgents()
                    }
                }
            }
        }
    }

    return (
        <>
            <div className={agentStyles.modal}>
                {loading && <Loader />}
                <div className={agentStyles['modal-content']}>
                    <div className={agentStyles.header}>
                        <p className={agentStyles.headertext}>Register {usertype === 'admin' ? 'Agent' : 'Admin'}</p>
                        <span className={agentStyles.close} onClick={() => setopenModal(false)}>&times;</span>
                    </div>
                    <div className={agentStyles.formView}>
                        <form>
                            <div className={agentStyles.forminput} style={{
                                marginTop: '1em',
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}>
                                {imageFile && <img src={imageFile} style={{
                                    marginTop: '2em',
                                    width: '10em',
                                    height: '10em'
                                }} />}
                                {!imageFile && <FormInput
                                    type="file"
                                    multiple={true}
                                    placeholder="Image"
                                    className={agentStyles.input}
                                    value={imageFile}
                                    onChange={(event) => handleChange(event)}
                                />}
                                {imageFile && <FormInput
                                    type="file"
                                    multiple={true}
                                    placeholder="Image"
                                    className={agentStyles.input}
                                    // value={imageFile}
                                    onChange={(event) => handleChange(event)}
                                />}
                                {imageFile === '' && <span className={agentStyles.error}>No image selected</span>}
                            </div>
                            <div className={agentStyles.forminput} style={{
                                marginTop: '.7em'
                            }}>
                                <FormInput
                                    type="text"
                                    placeholder="First Name"
                                    className={agentStyles.input}
                                    value={agentData.first_name}
                                    onChange={(event) => setagentData({ ...agentData, first_name: event.target.value })}
                                />
                                {agentData.first_name === '' && <span className={agentStyles.error}>First name is empty</span>}
                            </div>
                            <div className={agentStyles.forminput}>
                                <FormInput
                                    type="text"
                                    placeholder="Last Name"
                                    className={agentStyles.input}
                                    value={agentData.last_name}
                                    onChange={(event) => setagentData({ ...agentData, last_name: event.target.value })}
                                />
                                {agentData.last_name === '' && <span className={agentStyles.error}>Last name is empty</span>}
                            </div>
                            {usertype === 'super_admin' && <div className={agentStyles.forminput}>
                                <FormInput
                                    type="text"
                                    placeholder="Email"
                                    className={agentStyles.input}
                                    value={agentData.email}
                                    onChange={(event) => setagentData({ ...agentData, email: event.target.value })}
                                />
                                {agentData.email === '' && <span className={agentStyles.error}>Email is empty</span>}
                            </div>}
                            <div className={agentStyles.forminput}>
                                <FormInput
                                    type="text"
                                    placeholder="Phone Number"
                                    maxLength={11}
                                    className={agentStyles.input}
                                    value={agentData.mobile}
                                    onChange={(event) => setagentData({ ...agentData, mobile: event.target.value })}
                                />
                                {agentData.mobile === '' && <span className={agentStyles.error}>Mobile is empty</span>}
                            </div>
                            <div className={agentStyles.forminput}>
                                <FormInput
                                    type={passwordType === true ? 'password' : 'text'}
                                    placeholder="Password"
                                    className={agentStyles.input}
                                    value={agentData.password}
                                    onChange={(event) => setagentData({ ...agentData, password: event.target.value })}
                                />
                                <div
                                    onClick={() => setpasswordType(!passwordType)}
                                    style={{
                                        position: 'absolute',
                                        right: '.3em',
                                        top: '1.8em'
                                    }}>
                                    <i class="fa-solid fa-lock"></i>
                                </div>
                                {agentData.password === '' && <span className={agentStyles.error}>Password is empty</span>}
                            </div>
                            <div className={agentStyles.forminput}>
                                <FormInput
                                    type="text"
                                    placeholder="Gender"
                                    className={agentStyles.input}
                                    value={agentData.gender}
                                    onChange={(event) => setagentData({ ...agentData, gender: event.target.value })}
                                />
                                {agentData.gender === '' && <span className={agentStyles.error}>Gender is empty</span>}
                            </div>
                            <div className={agentStyles.forminput}>
                                <FormInput
                                    type="text"
                                    placeholder="NIN"
                                    className={agentStyles.input}
                                    value={agentData.nin}
                                    onChange={(event) => setagentData({ ...agentData, nin: event.target.value })}
                                />
                                {agentData.nin === '' && <span className={agentStyles.error}>NIN is empty</span>}
                            </div>
                            <div className={agentStyles.forminput}>
                                <FormInput
                                    type="text"
                                    placeholder="State"
                                    className={agentStyles.input}
                                    value={agentData.state}
                                    onChange={(event) => setagentData({ ...agentData, state: event.target.value })}
                                />
                                {agentData.state === '' && <span className={agentStyles.error}>State is empty</span>}
                            </div>
                            <div className={agentStyles.forminput}>
                                <FormInput
                                    type="text"
                                    placeholder="Local Govt Area"
                                    className={agentStyles.input}
                                    value={agentData.lga}
                                    onChange={(event) => setagentData({ ...agentData, lga: event.target.value })}
                                />
                            </div>
                            {agentData.lga === '' && <span className={agentStyles.error}>Local Govt Area is empty</span>}
                            <div className={agentStyles.forminput}>
                                <textarea id="w3review" name="w3review" rows="5" type="text"
                                    placeholder="Address"
                                    className={agentStyles.textarea}
                                    value={agentData.address}
                                    onChange={(event) => setagentData({ ...agentData, address: event.target.value })}></textarea>
                                {agentData.address === '' && <span className={agentStyles.error}>Address is empty</span>}
                            </div>
                            <div className={agentStyles.forminput}>
                                <button onClick={(event) => createAgent(event)}>Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
