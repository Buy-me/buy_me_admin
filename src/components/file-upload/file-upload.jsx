import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import styles from './file-upload.module.css'

// import { ImageConfig } from '../../config/ImageConfig'
// import uploadImg from '../../assets/cloud-upload-regular-240.png'

const DropFileInput = ({ onFileChange, data, isEdit, ...props }) => {
   const wrapperRef = useRef(null)

   const [fileList, setFileList] = useState([])
   const [fromEdit, setIsEdit] = useState(isEdit)

   const onDragEnter = () => wrapperRef.current.classList.add('dragover')

   const onDragLeave = () => wrapperRef.current.classList.remove('dragover')

   const onDrop = () => wrapperRef.current.classList.remove('dragover')

   useEffect(() => {
      if (isEdit) {
         setFileList([data.images?.url])
      }
   }, [])

   const onFileDrop = e => {
      setIsEdit(false)
      const newFile = e.target.files[0]
      if (newFile) {
         const updatedList = [newFile]
         setFileList(updatedList)
         onFileChange(updatedList, true)
      }
   }

   // const fileRemove = file => {
   //    const updatedList = [...fileList]
   //    updatedList.splice(fileList.indexOf(file), 1)
   //    setFileList(updatedList)
   //    props.onFileChange(updatedList)
   // }

   return (
      <>
         <div
            ref={wrapperRef}
            className={styles.dropFileInput}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
         >
            <div className={styles.dropFileInput__label}>
               <img
                  src={
                     'http://food-delivery-tb.s3-website-ap-southeast-1.amazonaws.com/logo/1720343.png'
                  }
                  alt=""
               />
               <p>Drag & Drop your files here</p>
            </div>
            <input type="file" value="" onChange={onFileDrop} />
         </div>
         {fileList.length > 0 ? (
            <div className="drop-file-preview">
               <p className={styles.dropFilePreview__title}>Ready to upload</p>
               {fromEdit ? (
                  <div className={styles.dropFilePreview__item}>
                     {/* <p>{item.name}</p> */}
                     <img src={fileList[0]} alt="" className={styles.dropFilePreview__item} />
                  </div>
               ) : (
                  fileList.map((item, index) => (
                     <div key={index} className={styles.dropFilePreview__item}>
                        {/* <p>{item.name}</p> */}
                        <img
                           src={URL.createObjectURL(item)}
                           alt=""
                           className={styles.dropFilePreview__item}
                        />
                     </div>
                  ))
               )}
            </div>
         ) : null}
      </>
   )
}

DropFileInput.propTypes = {
   onFileChange: PropTypes.func
}

export default DropFileInput
