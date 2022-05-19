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
		this.apiBase = "http://localhost/";

		this.layerCropInitial = {
			progressText: "Uploading...",
			cropComplete: false,
			croppedImage: null,
			uploadInProgress: false,
			show: false,
			layerData: null,
			image: null,
			crop: { x: 0, y: 0 },
			zoom: 1,
			aspect: 1 / 1,
			croppedAreaPixels: {},
		};
		this.state = {
			layerCropper: this.layerCropInitial,
			projectid: null,
			exportedPreview: null,
			pollPreview: {
				stage: "INITIAL",
			},
			redirect: null,
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
				let url = URL.createObjectURL(this.dataURItoBlob(event.target.result));
				this.setState({
					layerCropper: {
						...this.state.layerCropper,
						show: true,
						layerData: layer,
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
					className={"pr_popup_main".concat(this.state.layerCropper.cropComplete ? " pr_crop_preview" : "")}
					ref={this.mainPopupArea}
				>
					{this.state.layerCropper.cropComplete ? (
						<div className="pr_cropped_preview">
							<img src={this.state.layerCropper.croppedImage} alt="Cropped Preview" />
							<h3>{this.state.layerCropper.progressText}</h3>
						</div>
					) : (
						<Fragment>
							<h1 className="pr_modal_heading">Fit Your Picture and Click "SAVE" to Upload</h1>
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
								<button className="pr_btn_second" onClick={this.closeCropper}>
									Cancel
								</button>
								<button onClick={this.uploadDisplayPicture}>Save</button>
							</div>
						</Fragment>
					)}
				</div>
			</div>
		);
	};
	pollPreview = () => {
		this.setState({
			pollPreview: {
				...this.state.pollPreview,
				stage: "FETCHING",
			},
		});
		fetch(`${this.apiBase}export/${this.targetMockup.id}/${this.state.projectid}`)
			.then((e) => e.json())
			.then((res) => {
				if (!res.url) {
					alert("Something went wrong while updating preview.");
					return;
				}
				this.setState({
					exportedPreview: `${this.apiBase}${res.url}`,
				});
			})
			.catch((e) => {
				alert(`Something went wrong while updating preview : ${e}`);
			})
			.finally(() => {
				this.setState({
					pollPreview: {
						...this.state.pollPreview,
						stage: "INITIAL",
					},
				});
			});
	};
	uploadDisplayPicture = async () => {
		let croppedImage = await getCroppedImg(
			this.state.layerCropper.image,
			this.state.layerCropper.croppedAreaPixels
		);
		this.setState({
			layerCropper: {
				...this.state.layerCropper,
				cropComplete: true,
				croppedImage: URL.createObjectURL(croppedImage),
				uploadInProgress: true,
			},
		});
		const _finally = () => {
			this.setState({
				layerCropper: {
					...this.state.layerCropper,
					uploadInProgress: false,
				},
			});
			this.closeCropper();
		};
		let fd = new FormData();
		let thumbFileObject = new File([croppedImage], "layer.png");
		fd.append("layer", thumbFileObject, "layer.png");
		if (this.state.projectid) {
			fd.append("projectid", this.state.projectid);
		}
		let requestOptions = {
			method: "POST",
			body: fd,
			redirect: "follow",
		};
		console.log(this.targetMockup.id);
		fetch(`${this.apiBase}project/${this.targetMockup.id}/${this.state.layerCropper.layerData.id}`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (!result.success) {
					alert(`Something went wrong while uploading selected layer: ${result.message}`);
					return;
				}
				_finally();
				this.setState({
					projectid: result.projectid,
				});
				this.pollPreview();
			})
			.catch((error) => {
				alert(`Something went wrong while uploading selected layer: ${error}`);
				_finally();
				console.log("error", error);
			});
	};
	previewLoader = () => {
		return (
			<div className="pr_preview_loader">
				<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
							<stop stopColor="#fff" stopOpacity="0" offset="0%" />
							<stop stopColor="#fff" stopOpacity=".631" offset="63.146%" />
							<stop stopColor="#fff" offset="100%" />
						</linearGradient>
					</defs>
					<g fill="none" fillRule="evenodd">
						<g transform="translate(1 1)">
							<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2">
								<animateTransform
									attributeName="transform"
									type="rotate"
									from="0 18 18"
									to="360 18 18"
									dur="0.9s"
									repeatCount="indefinite"
								/>
							</path>
							<circle fill="#fff" cx="36" cy="18" r="1">
								<animateTransform
									attributeName="transform"
									type="rotate"
									from="0 18 18"
									to="360 18 18"
									dur="0.9s"
									repeatCount="indefinite"
								/>
							</circle>
						</g>
					</g>
				</svg>
			</div>
		);
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
					<span
						className="pr_back"
						style={{
							cursor: "pointer",
						}}
						onClick={() => {
							this.setState({
								redirect: "/",
							});
						}}
					>
						Go Back
					</span>
					<h1 className="centered">Edit Mockup</h1>
					<div className="pr_mockup_editor">
						<div className="pr_live_mockup_preview">
							<img
								src={this.state.exportedPreview || this.targetMockup.mockup}
								alt=""
								draggable={false}
							/>
							{this.state.pollPreview.stage === "FETCHING" ? <this.previewLoader /> : null}
							{this.state.exportedPreview ? (
								<button
									style={{ width: "100%" }}
									onClick={() => {
										let a = document.createElement("a");
										a.href = this.state.exportedPreview;
										a.target = "_blank";
										a.download = "psd-replika (shubhamprajapat.com).jpg";
										a.click();
									}}
								>
									Download
								</button>
							) : null}
						</div>
						<div className="pr_layer_edit">
							<h2 className="m0">Layers</h2>
							<div className="pr_layer_list">
								{this.targetMockup.editableLayers.map((layer, index) => {
									return (
										<div className="pr_layer_info" key={layer.id}>
											<h3 className="pr_layer_title">
												{index + 1}. {layer.label}
												<span className="pr_badge">
													{`${layer.ratio.w}:${layer.ratio.h.toFixed(2)}`}
												</span>
												<span className="pr_badge">{`${layer.px.w}x${layer.px.h}px`}</span>
											</h3>
											<div className="pr_layer_change">
												<button
													onClick={() => {
														this.handleLayerChange(layer);
													}}
												>
													Change {layer.label}
												</button>
											</div>
										</div>
									);
								})}
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
