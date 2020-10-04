import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import mockuplist from "../mockuplist";
import Cropper from "react-easy-crop";
import getCroppedImg from "./../helpers/cropimage";
class MockupEditor extends Component {
    constructor(props) {
        super(props);
        let { mockupid } = this.props.match.params;
        this.targetMockup = mockuplist.find((m) => m.id === mockupid);
        this.state = {
            redirect: null,
        };

        this.layerCropInitial = {
            progressText: "Uploading...",
            cropComplete: false,
            croppedImage: null,
            uploadInProgress: false,
            show: false,
            image:
                "http://localhost:3000/static/media/book-mockup.47324234.jpg",
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 1 / 1,
            croppedAreaPixels: {},
        };
        this.state = {
            layerCropper: this.layerCropInitial,
        };
    }
    dataURItoBlob = (dataURI) => {
        let byteString = atob(dataURI.split(",")[1]);
        let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        let blob = new Blob([ab], { type: mimeString });
        return blob;
    };
    onCropChange = (crop) => {
        this.setState({
            layerCropper: {
                ...this.state.layerCropper,
                crop,
            },
        });
    };

    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({
            layerCropper: {
                ...this.state.layerCropper,
                croppedAreaPixels,
            },
        });
    };

    onZoomChange = (zoom) => {
        this.setState({
            layerCropper: {
                ...this.state.layerCropper,
                zoom,
            },
        });
    };
    handleLayerChange = (layer) => {
        let aspect = layer.ratio.w / layer.ratio.h;
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            let files = e.target.files;
            if (files.length === 0) return;
            let selectedImage = files[0];
            let fr = new FileReader();
            fr.onloadend = async (event) => {
                let url = URL.createObjectURL(
                    this.dataURItoBlob(event.target.result)
                );
                this.setState({
                    layerCropper: {
                        ...this.state.layerCropper,
                        show: true,
                        image: url,
                        aspect,
                    },
                });
            };
            fr.readAsDataURL(selectedImage);
        };

        input.click();
    };
    closeCropper = () => {
        if (this.state.layerCropper.uploadInProgress) return;
        this.setState({
            layerCropper: this.layerCropInitial,
        });
    };
    CropperPopup = () => {
        return (
            <div className="pr_popup_wrapper">
                <div
                    className={"pr_popup_main".concat(
                        this.state.layerCropper.cropComplete
                            ? " pr_crop_preview"
                            : ""
                    )}
                    ref={this.mainPopupArea}
                >
                    {this.state.layerCropper.cropComplete ? (
                        <div className="pr_cropped_preview">
                            <img
                                src={this.state.layerCropper.croppedImage}
                                alt="Cropped Preview"
                            />
                            <h3>{this.state.layerCropper.progressText}</h3>
                        </div>
                    ) : (
                        <Fragment>
                            <h1 className="pr_modal_heading">
                                Fit Your Picture and Click "SAVE" to Upload
                            </h1>
                            <div className="pr_cropper_parent">
                                <Cropper
                                    image={this.state.layerCropper.image}
                                    crop={this.state.layerCropper.crop}
                                    zoom={this.state.layerCropper.zoom}
                                    showGrid={false}
                                    maxZoom={3}
                                    aspect={this.state.layerCropper.aspect}
                                    onCropChange={this.onCropChange}
                                    onCropComplete={this.onCropComplete}
                                    onZoomChange={this.onZoomChange}
                                />
                            </div>
                            <div className="pr_modal_action_btns">
                                <button
                                    className="pr_btn_second"
                                    onClick={this.closeCropper}
                                >
                                    Cancel
                                </button>
                                <button onClick={this.uploadDisplayPicture}>
                                    Save
                                </button>
                            </div>
                        </Fragment>
                    )}
                </div>
            </div>
        );
    };
    uploadDisplayPicture = async () => {
        let croppedImage = await getCroppedImg(
            this.state.layerCropper.image,
            this.state.layerCropper.croppedAreaPixels
        );
        console.log(croppedImage);
        this.setState({
            layerCropper: {
                ...this.state.layerCropper,
                cropComplete: true,
                croppedImage: URL.createObjectURL(croppedImage),
                uploadInProgress: true,
            },
        });

        const setProgress = (p) => {
            let completeRate = (98 * p) / 100;
            this.setState({
                layerCropper: {
                    ...this.state.layerCropper,
                    progressText: `Uploading (${completeRate}%)`,
                },
            });
        };
        let handleUpload = {
            onStart: () => {
                setProgress(0);
            },
            onProgress: (loaded, total) => {
                let p = (loaded / total) * 100;
                setProgress(parseInt(p));
            },
            onEnd: () => {
                setProgress(100);
            },
        };
        const _finally = () => {
            this.setState({
                layerCropper: {
                    ...this.state.layerCropper,
                    uploadInProgress: false,
                },
            });
            this.closeCropper();
            this.props.getUserInfo();
        };
        let n = "newdp";
        let fd = new FormData();
        let thumbFileObject = new File([croppedImage], "newdp.jpg");
        fd.append(n, thumbFileObject, "newdp.jpg");
        fd.append(
            "dir",
            JSON.stringify({
                newdp: "profile",
            })
        );

        /* let uploadReq = postman.upload(
            "/upload/asset",
            fd,
            handleUpload.onStart,
            handleUpload.onProgress,
            handleUpload.onEnd
        );
        uploadReq.then(async (xhr) => {
            if (!xhr.responseText.startsWith("{")) {
                AlertMsg("error", "Network error", "Please try again.");
                _finally();
                return;
            }
            let res = JSON.parse(xhr.responseText);
            if (!res.success) {
                AlertMsg("error", res.message);
                _finally();
                return;
            }
            if (!res.data["newdp"].uploaded) {
                AlertMsg("error", res.data["newdp"].error);
                _finally();
                return;
            }
            let cloudSrc = res.data["newdp"].url;
            postman
                .post(
                    "/usercontent",
                    {
                        body: JSON.stringify({
                            key: "profiles",
                            data: {
                                url: cloudSrc,
                            },
                        }),
                    },
                    { loader: false }
                )
                .catch((e) => {
                    AlertMsg(
                        "error",
                        "Something went wrong!",
                        JSON.stringify(e)
                    );
                })
                .finally(_finally);
        }); */
    };
    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        }
        if (!this.targetMockup?.mockup) {
            return (
                <div className="pr_container">
                    <h1 className="centered">No Such Mockup Found.</h1>
                </div>
            );
        }
        return (
            <Fragment>
                <div className="pr_container">
                    <h1 className="centered">Edit Mockup</h1>
                    <div className="pr_mockup_editor">
                        <div className="pr_live_mockup_preview">
                            <img
                                src={this.targetMockup.mockup}
                                alt=""
                                draggable={false}
                            />
                        </div>
                        <div className="pr_layer_edit">
                            <h2 className="m0">Layers</h2>
                            <div className="pr_layer_list">
                                {this.targetMockup.editableLayers.map(
                                    (layer, index) => {
                                        return (
                                            <div
                                                className="pr_layer_info"
                                                key={layer.id}
                                            >
                                                <h3 className="pr_layer_title">
                                                    {index + 1}. {layer.label}
                                                    <span className="pr_badge">
                                                        {`${
                                                            layer.ratio.w
                                                        }:${layer.ratio.h.toFixed(
                                                            2
                                                        )}`}
                                                    </span>
                                                    <span className="pr_badge">
                                                        {`${layer.px.w}x${layer.px.h}px`}
                                                    </span>
                                                </h3>
                                                <div className="pr_layer_change">
                                                    <button
                                                        onClick={() => {
                                                            this.handleLayerChange(
                                                                layer
                                                            );
                                                        }}
                                                    >
                                                        Change {layer.label}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.layerCropper.show ? <this.CropperPopup /> : null}
            </Fragment>
        );
    }
}

export default MockupEditor;
