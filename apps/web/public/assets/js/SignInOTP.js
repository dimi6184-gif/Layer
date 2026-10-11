import{jsx as _jsx}from"react/jsx-runtime";import{useEffect,useMemo,useState}from"react";// @ts-ignore
import{addPropertyControls,ControlType,withCSS}from"framer";import{signInOTP}from"https://cdn.jsdelivr.net/npm/@framerauth/sdk@2/dist/framerauth.mjs";import BaseForm,{basePropertyControls,getURLSearchParam}from"https://framerusercontent.com/modules/tU0OhNHakDNO2P6BFnP9/DkAA5y3AozKVoSSPI9gf/BaseForm.js";//////////////////////////////////
/////// FORM CONFIGURATION ///////
//////////////////////////////////
// Define inputs
const baseInputs=[{displayName:"Code",name:"otp",type:"string",required:true,overridable:false,placeholder:"Code",render:true,hidden:false}];const formId="signin_otp"// Unique form ID for this form.
;const defaultButtonLabel="Sign In"// Default submit button label on this form.
;const buttonLabelKey=`${formId}_button_label`// Key for button label property control.
;/**
 * SignInOTP.tsx
 * By Joel Whitaker
 *
 * @framerDisableUnlink
 *
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 40
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any
 */const SignInOTP=withCSS(function SignInOTP({...baseProps}){const[inputs,setInputs]=useState(baseInputs)// We can override inputs with property controls.
;const[email,setEmail]=useState(null);useEffect(()=>{const email=getURLSearchParam("email");setEmail(email);},[]);const buttonProps=useMemo(()=>{// Map button label to button
// This is to avoid style copy-pasting of the button label.
return{...baseProps.button,label:baseProps.button[buttonLabelKey]};},[baseProps.button,baseProps.button[buttonLabelKey]]);useEffect(()=>{// Map input labels to inputs
if(baseProps.inputFields){const newInputs=[];baseInputs.forEach((input,_idx)=>{const inputControlName=snakeToCamel(input.name);if(!(inputControlName in baseProps.inputFields)){// If the input is not in the inputFields object, skip it.
return;}const inputField=baseProps.inputFields[inputControlName];const render=inputField.render||true;const hidden=inputField.hidden||false;const displayName=inputField.displayName;const placeholder=displayName;if(render===true){newInputs.push({...input,hidden,displayName,placeholder});}});setInputs(newInputs);}},[undefined,baseProps.inputFields]);const onSubmit=async formData=>{if(!email){return{ok:false,message:"Email not found."};}const signInResponse=await signInOTP({email:email,otp:formData.otp});if(signInResponse.error){return{ok:false,message:signInResponse.error.message};}return{ok:true,message:"Successfully Signed in."};};return /*#__PURE__*/_jsx(BaseForm,{...baseProps,button:buttonProps,fields:inputs,onSubmit:onSubmit});},[]);const snakeToCamel=str=>{return str.split("_").map((word,index)=>{if(index===0){return word;}return word.charAt(0).toUpperCase()+word.slice(1);}).join("");};// Here we can override property controls if we don't want to expose them to the user.
// We generate the inputs property controls dynamically based on the inputs array.
const inputsPropertyControls={};baseInputs.forEach((input,_idx)=>{const inputControlName=snakeToCamel(input.name);inputsPropertyControls[inputControlName]={title:`${input.displayName}`,type:ControlType.Object,controls:{render:input.overridable===true?{title:"Render",type:ControlType.Boolean,defaultValue:true}:undefined,hidden:input.overridable===true?{title:"Hidden",type:ControlType.Boolean,defaultValue:false,hidden:props=>props.render===true}:undefined,displayName:{title:"Display Name",type:ControlType.String,defaultValue:input.displayName,hidden:props=>props.render===true&&props.hidden===false}}};});const exportBasePropertyControls={...basePropertyControls,inputFields:{title:"Inputs",type:ControlType.Object,controls:inputsPropertyControls},link:{title:"Redirect",type:ControlType.Link},button:{// Inject default button label
...basePropertyControls.button,controls:{...basePropertyControls.button.controls,label:undefined,[buttonLabelKey]:{...basePropertyControls.button.controls.label,defaultValue:defaultButtonLabel}}}};// @ts-ignore - TS doesn't like our basePropertyControls type.
addPropertyControls(SignInOTP,exportBasePropertyControls);SignInOTP.defaultProps={...BaseForm.defaultProps,...SignInOTP.defaultProps};export default SignInOTP;
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"SignInOTP","slots":[],"annotations":{"framerIntrinsicWidth":"300","framerIntrinsicHeight":"40","framerDisableUnlink":"*","framerSupportedLayoutWidth":"fixed","framerSupportedLayoutHeight":"any","framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}