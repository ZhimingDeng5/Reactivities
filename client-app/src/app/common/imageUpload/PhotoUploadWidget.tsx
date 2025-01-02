import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCroppet";

interface Props {
    loading:boolean;
    uploadPhoto:(File:Blob)=>void;
}

export default function PhotoUploadWidget({loading,uploadPhoto}:Props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>()

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob=>uploadPhoto(blob!))
        }
    }

    useEffect(()=>{
        return ()=>{
            files.forEach((file: any)=>URL.revokeObjectURL(files.preview))
        }
    },[files])
    return (
        <Grid>
            <Grid.Column width={4}>
                <Header color='teal' content='Step 1 - AddPhoto'/>
                <PhotoWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header color='teal' content='Step 2 - Resize Image'/>
                {files && files.length>0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header color='teal' content='Step 3 - Preview & Upload'/>
                {files && files.length>0 &&
                <>
                    <div className="img-preview" style={{minHeight:200, overflow:'hidden'}}/>
                    <Button onClick={onCrop} loading={loading} positive icon='check'/>
                    <Button onClick={()=>setFiles([])} disabled={loading} icon='close'/>
                </>
                }

            </Grid.Column>
        </Grid>
    )
}