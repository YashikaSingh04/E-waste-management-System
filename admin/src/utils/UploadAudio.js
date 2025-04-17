/* eslint-disable react-hooks/exhaustive-deps */
import { Upload, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import fileService from "../services/file";
import React from "react";

export default function UploadAudio({ fileList, setFileList, count = 1, disabled = false }) {
    const uploadImage = async options => {
        const { onSuccess, onError, file, onProgress } = options;

        const fmData = new FormData();
        const config = { onUploadProgress: event => { onProgress({ percent: (event.loaded / event.total) * 100 }); } };
        fmData.append("file", file);
        try {
            fileService.save(fmData, config).then(res => {
                onSuccess("Ok");
                setFileList([...fileList, { uid: res.data.uid, url: res.data.url, name: res.data.name }]);
            })
        } catch (err) {
            onError({ err });
        }
    };

    const handleOnChange = ({ file, fl }) => {
        if (typeof fl !== typeof []) {
            fl = [];
        }
        setFileList(fl);

    };
    const handleRemove = (file) => {
        fileService.remove({ uid: file.uid }).then(res => {
        })
    };

    return <Upload
        accept="audio/*"
        customRequest={uploadImage}
        onChange={handleOnChange}
        onRemove={handleRemove}
        fileList={fileList}
        className="image-upload-grid"
        disabled={disabled}
        onPreview={(file) => {
            return fetch(file.url, {
                method: 'GET',
            })
                .then(res => res.json())
                .then(({ thumbnail }) => {
                    return thumbnail;
                });
        }}
    >
        {fileList?.length >= count ? null : <Button icon={<UploadOutlined />}>Upload</Button>
        }
    </Upload >

};