import{jsx as _jsx}from"react/jsx-runtime";import{useEffect,useMemo,useState}from"react";// @ts-ignore
import{addPropertyControls,ControlType,withCSS,// @ts-ignore
inferInitialRouteFromPath,// @ts-ignore
useRouter}from"framer";import{sendOTP}from"https://cdn.jsdelivr.net/npm/@framerauth/sdk@2/dist/framerauth.mjs";import BaseForm,{basePropertyControls,getURLSearchParam}from"https://framerusercontent.com/modules/tU0OhNHakDNO2P6BFnP9/DkAA5y3AozKVoSSPI9gf/BaseForm.js";//////////////////////////////////
/////// FORM CONFIGURATION ///////
//////////////////////////////////
// Define inputs
const baseInputs=[{displayName:"Email",name:"email",type:"string",format:"email",required:true,overridable:false,placeholder:"Email",render:true,hidden:false}];const formId="signin_send_otp"// Unique form ID for this form.
;const defaultButtonLabel="Send Code"// Default submit button label on this form.
;const buttonLabelKey=`${formId}_button_label`// Key for button label property control.
;/**
 * SendOTP.tsx
 * By Joel Whitaker
 *
 * @framerDisableUnlink
 *
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 40
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any
 */const SendOTP=withCSS(function SendOTP({...baseProps}){const router=useRouter();const[inputs,setInputs]=useState(baseInputs)// We can override inputs with property controls.
;const[defaultValues,setDefaultValues]=useState(undefined);const buttonProps=useMemo(()=>{// Map button label to button
// This is to avoid style copy-pasting of the button label.
return{...baseProps.button,label:baseProps.button[buttonLabelKey]};},[baseProps.button,baseProps.button[buttonLabelKey]]);useEffect(()=>{const email=getURLSearchParam("email");setDefaultValues({email:email});},[]);useEffect(()=>{// Map input labels to inputs
if(baseProps.inputFields){const newInputs=[];baseInputs.forEach((input,_idx)=>{const inputControlName=snakeToCamel(input.name);if(!(inputControlName in baseProps.inputFields)){// If the input is not in the inputFields object, skip it.
return;}const inputField=baseProps.inputFields[inputControlName];const render=inputField.render||true;const hidden=inputField.hidden||false;const displayName=inputField.displayName;const placeholder=displayName;if(render===true){newInputs.push({...input,hidden,displayName,placeholder});}});setInputs(newInputs);}},[undefined,baseProps.inputFields]);const onSubmit=async formData=>{const sendOTPResponse=await sendOTP({email:formData.email,type:"sign-in"});if(sendOTPResponse.error){return{ok:false,message:sendOTPResponse.error.message};}return{ok:true,message:sendOTPResponse.data?.message||"Email instructions sent.",data:{email:formData.email}};};const onSuccessCallback=data=>{const emailValue=data?.email;const configuredLink=baseProps.link;if(!configuredLink||typeof configuredLink!=="string"||!emailValue){return;}try{const normalizedLink=configuredLink.trim();if(!normalizedLink)return;let path="";if(normalizedLink.startsWith("/")){const[pathAndQuery]=normalizedLink.split("#");path=pathAndQuery.split("?")[0];}else if(typeof window!=="undefined"){path=new URL(normalizedLink,window.location.origin).pathname;}else{path=new URL(normalizedLink,"https://example.com").pathname;}if(!path)return;const emailParam=`email=${encodeURIComponent(String(emailValue))}`;const{routeId,pathVariables}=inferInitialRouteFromPath(router.routes,path);if(routeId){router.navigate(routeId,emailParam,pathVariables);}}catch(_error){// Invalid or unsupported link format, skip navigation safely.
}};return /*#__PURE__*/_jsx(BaseForm,{...baseProps,button:buttonProps,fields:inputs,defaultValues:defaultValues,onSubmit:onSubmit,onSuccess:onSuccessCallback});},[]);const snakeToCamel=str=>{return str.split("_").map((word,index)=>{if(index===0){return word;}return word.charAt(0).toUpperCase()+word.slice(1);}).join("");};// Here we can override property controls if we don't want to expose them to the user.
// We generate the inputs property controls dynamically based on the inputs array.
const inputsPropertyControls={};baseInputs.forEach((input,_idx)=>{const inputControlName=snakeToCamel(input.name);inputsPropertyControls[inputControlName]={title:`${input.displayName}`,type:ControlType.Object,controls:{render:input.overridable===true?{title:"Render",type:ControlType.Boolean,defaultValue:true}:undefined,hidden:input.overridable===true?{title:"Hidden",type:ControlType.Boolean,defaultValue:false,hidden:props=>props.render===true}:undefined,displayName:{title:"Display Name",type:ControlType.String,defaultValue:input.displayName,hidden:props=>props.render===true&&props.hidden===false}}};});const exportBasePropertyControls={...basePropertyControls,inputFields:{title:"Inputs",type:ControlType.Object,controls:inputsPropertyControls},link:{title:"Redirect",type:ControlType.Link},button:{// Inject default button label
...basePropertyControls.button,controls:{...basePropertyControls.button.controls,label:undefined,[buttonLabelKey]:{...basePropertyControls.button.controls.label,defaultValue:defaultButtonLabel}}}};// @ts-ignore - TS doesn't like our basePropertyControls type.
addPropertyControls(SendOTP,exportBasePropertyControls);SendOTP.defaultProps={...BaseForm.defaultProps,...SendOTP.defaultProps};export default SendOTP;
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"SendOTP","slots":[],"annotations":{"framerContractVersion":"1","framerSupportedLayoutWidth":"fixed","framerSupportedLayoutHeight":"any","framerIntrinsicWidth":"300","framerDisableUnlink":"*","framerIntrinsicHeight":"40"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./SendOTP.map