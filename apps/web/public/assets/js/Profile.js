import{jsx as _jsx}from"react/jsx-runtime";import{useEffect,useMemo,useRef,useState}from"react";// @ts-ignore
import{addPropertyControls,ControlType,RenderTarget,withCSS}from"framer";import{useUser,useProject,useIsInitializing,updateProfile}from"https://cdn.jsdelivr.net/npm/@framerauth/sdk@2/dist/framerauth.mjs";import BaseForm,{basePropertyControls,safeParseCustomFields,secondaryButtonControl}from"https://framerusercontent.com/modules/tU0OhNHakDNO2P6BFnP9/DkAA5y3AozKVoSSPI9gf/BaseForm.js";//////////////////////////////////
/////// FORM CONFIGURATION ///////
//////////////////////////////////
// Define inputs
const baseInputs=[{displayName:"Name",name:"name",type:"string",required:true,overridable:false,placeholder:"Name",render:true,hidden:false},{displayName:"Email",name:"email",type:"string",format:"email",required:true,overridable:false,placeholder:"Email",render:true,hidden:false}];// Password inputs are appended dynamically based on whether the member
// already has a password (`user.has_password`) and are never sent as-is:
// onSubmit maps them to the API's `currentPassword`/`newPassword` params.
const setPasswordFields=[{displayName:"Set password",name:"new_password",type:"string",format:"password",required:false,overridable:false,placeholder:"Set password",description:"Set a password to sign-in with Email & Password",render:true,hidden:false},{displayName:"Confirm password",name:"confirm_password",type:"string",format:"password",required:false,overridable:false,placeholder:"Confirm password",render:true,hidden:false}];const changePasswordFields=[{displayName:"Current Password",name:"current_password",type:"string",format:"password",required:false,overridable:false,placeholder:"Current Password",render:true,hidden:false},{displayName:"New Password",name:"new_password",type:"string",format:"password",required:false,overridable:false,placeholder:"New Password",render:true,hidden:false}];const formId="member_profile"// Unique form ID for this form.
;const defaultButtonLabel="Save Changes"// Default submit button label on this form.
;const exposeIconColor=false// Expose icon color property for input icons (eg hide/show password icon).
;const buttonLabelKey=`${formId}_button_label`// Key for button label property control.
;// Form-unique keys for the secondary button's text, so its labels aren't
// carried between forms via Framer's copy/paste-style (see buttonLabelKey).
const secondaryButtonLabelKey=`${formId}_secondary_button_label`;const secondaryButtonCancelLabelKey=`${formId}_secondary_button_cancel_label`;function isFramerEditorTarget(){const target=RenderTarget.current();return target===RenderTarget.canvas||target===RenderTarget.thumbnail;}function hasFramerAuthRuntime(){return typeof window!=="undefined"&&Boolean(window.FramerAuth);}/**
 * Profile.tsx
 * By Joel Whitaker
 *
 * @framerDisableUnlink
 *
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 40
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any
 */const Profile=withCSS(function Profile({...baseProps}){const userState=useUser();const{user,setUser}=userState;const userLoading=userState.isLoading??userState.loading;const projectState=useProject();const{project,fetchProject}=projectState;const projectLoading=projectState.isLoading??projectState.loading;const sdkState=useIsInitializing();const sdkInitializing=sdkState.initializing;const hasRequestedProjectRef=useRef(false);const runtimeAvailable=hasFramerAuthRuntime();const[defaultValues,setDefaultValues]=useState(undefined);const shouldWaitForData=runtimeAvailable&&!isFramerEditorTarget();useEffect(()=>{if(shouldWaitForData||hasRequestedProjectRef.current||project){return;}hasRequestedProjectRef.current=true;fetchProject().catch(()=>{});},[shouldWaitForData,project,fetchProject]);const customFields=useMemo(()=>{if(project&&project?.customFields.length>0){const safeCustomFields=safeParseCustomFields(project?.customFields);if(safeCustomFields.success){return safeCustomFields.data;}}return[];},[project]);const[inputs,setInputs]=useState(baseInputs)// We can override inputs with property controls.
;const[isChangingPassword,setIsChangingPassword]=useState(false);// Both the session response and the PATCH /profile response carry
// `has_password` (snake_case).
const hasPassword=Boolean(user?.has_password);// On the canvas there is no user, so show the collapsed "change password"
// state to let designers style the secondary button.
const isEditorTarget=isFramerEditorTarget();const requiresCurrentPassword=isEditorTarget||hasPassword;const showPasswordSection=isEditorTarget||Boolean(user);useEffect(()=>{if(user){setDefaultValues(user);}},[user]);const isInitializing=shouldWaitForData&&(Boolean(sdkInitializing)||Boolean(projectLoading)||Boolean(userLoading));const buttonProps=useMemo(()=>{// Map button label to button
// This is to avoid style copy-pasting of the button label.
return{...baseProps.button,label:baseProps.button[buttonLabelKey]};},[baseProps.button,baseProps.button[buttonLabelKey]]);const secondaryButtonProps=useMemo(()=>{// Map the form-unique label keys back to label/cancelLabel so BaseForm
// reads them normally. Same copy/paste-style guard as the main button.
return{...baseProps.secondaryButton,label:baseProps.secondaryButton?.[secondaryButtonLabelKey],cancelLabel:baseProps.secondaryButton?.[secondaryButtonCancelLabelKey]};},[baseProps.secondaryButton]);useEffect(()=>{// Map input labels to inputs
if(baseProps.inputFields){const newInputs=[];baseInputs.forEach((input,_idx)=>{const inputControlName=snakeToCamel(input.name);if(!(inputControlName in baseProps.inputFields)){// If the input is not in the inputFields object, skip it.
return;}const inputField=baseProps.inputFields[inputControlName];const render=inputField.render||true;const hidden=inputField.hidden||false;const displayName=inputField.displayName;const placeholder=displayName;if(render===true){newInputs.push({...input,hidden,displayName,placeholder});}});setInputs(newInputs);}},[baseProps.inputFields]);const onSubmit=async formData=>{const customInputFieldFormData=formData;// Map password inputs to the API's camelCase params, omitting the
// keys entirely when the inputs are untouched.
const currentPassword=customInputFieldFormData.current_password??"";const newPassword=customInputFieldFormData.new_password??"";const confirmPassword=customInputFieldFormData.confirm_password??"";const passwordFormData={};if(currentPassword||newPassword||confirmPassword){if(!hasPassword&&newPassword!==confirmPassword){return{ok:false,message:"Passwords do not match."};}if(newPassword){passwordFormData.newPassword=newPassword;}if(currentPassword){passwordFormData.currentPassword=currentPassword;}}const customInputFormData={};customFields.forEach(customField=>{let value=customInputFieldFormData[customField.name];if(customField.type==="boolean"){value=value==="on"||typeof value==="boolean"&&value===true;}else if(customField.type==="number"){value=Number(value);}else{value=String(value);}customInputFormData[customField.name]=value;});const updateResponse=await updateProfile({email:formData.email,name:formData.name,...customInputFormData,...passwordFormData});if(updateResponse.error){return{ok:false,message:updateResponse.error.message};}// Collapse the password section again; BaseForm resets the inputs.
setIsChangingPassword(false);// Merge the PATCH response into the stored user. It carries the
// updated name/email/custom fields, and profile updates can't change
// tags, so there's nothing session-only left to refetch — skip the
// extra /get-session round-trip.
//
// Don't trust the response's `has_password`; derive the flag locally
// and set it last so it overrides anything the response echoed. A
// successful update that set a new password means the member now has
// one, and a password is never removed via this form, so any other
// update leaves the existing flag untouched.
const passwordWasSet=Boolean(passwordFormData.newPassword);setUser({...user,...updateResponse.data,has_password:hasPassword||passwordWasSet});return{ok:true,message:"Profile updated successfully."};};const passwordFields=useMemo(()=>{if(!showPasswordSection){return[];}if(!requiresCurrentPassword){return setPasswordFields;}return isChangingPassword?changePasswordFields:[];},[showPasswordSection,requiresCurrentPassword,isChangingPassword]);const refinedFields=useMemo(()=>{const refinedCustomFields=customFields.map(field=>({// For custom fields, make sure the placeholder is always set
    // - either based on the given placeholder, or the displayName as a fallback.
    ...field,placeholder:field.placeholder||field.displayName}));const allFields=[...inputs,...refinedCustomFields,...passwordFields];const refinedFields=allFields.map(field=>{let refinedField=field;if(field.overridable){const overrides=baseProps.inputFields[field.name];if(overrides){refinedField={...refinedField,...overrides};}}return refinedField;}).filter(input=>input.render!==false);return refinedFields;},[inputs,customFields,passwordFields]);// Secondary button that expands/collapses the change-password inputs.
// Members without a password see the set-password inputs inline instead,
// so the toggle is only wired up when a current password is required.
// BaseForm renders and styles the button (below the main button) from the
// `secondaryButton` property control.
const secondaryButtonAction=showPasswordSection&&requiresCurrentPassword?{active:isChangingPassword,onClick:()=>setIsChangingPassword(prev=>!prev)}:null;return /*#__PURE__*/_jsx(BaseForm,{...baseProps,isInitializing:isInitializing,button:buttonProps,fields:refinedFields,defaultValues:defaultValues,onSubmit:onSubmit,secondaryButton:secondaryButtonProps,secondaryButtonAction:secondaryButtonAction});},[]);const snakeToCamel=str=>{return str.split("_").map((word,index)=>{if(index===0){return word;}return word.charAt(0).toUpperCase()+word.slice(1);}).join("");};// Here we can override property controls if we don't want to expose them to the user.
// We generate the inputs property controls dynamically based on the inputs array.
const inputsPropertyControls={};baseInputs.forEach((input,_idx)=>{const inputControlName=snakeToCamel(input.name);inputsPropertyControls[inputControlName]={title:`${input.displayName}`,type:ControlType.Object,controls:{render:input.overridable===true?{title:"Render",type:ControlType.Boolean,defaultValue:true}:undefined,hidden:input.overridable===true?{title:"Hidden",type:ControlType.Boolean,defaultValue:false,hidden:props=>props.render===true}:undefined,displayName:{title:"Display Name",type:ControlType.String,defaultValue:input.displayName,hidden:props=>props.render===true&&props.hidden===false}}};});// Keys are enumerated explicitly (rather than spreading basePropertyControls)
// so the panel order can place "Secondary Button" directly beneath "Button".
const exportBasePropertyControls={label:basePropertyControls.label,input:{...basePropertyControls.input,controls:{...basePropertyControls.input.controls,iconColor:exposeIconColor?{// Add icon color property so users can control input icons (eg hide/show password icon).
title:"Icons",type:ControlType.Color,defaultValue:"#000"}:undefined}},button:{// Inject default button label
...basePropertyControls.button,controls:{...basePropertyControls.button.controls,label:undefined,[buttonLabelKey]:{...basePropertyControls.button.controls.label,defaultValue:defaultButtonLabel}}},// Toggles the change-password inputs for members with a password.
// Defined in BaseForm and opted into here so it's only exposed on forms
// that need it. Positioned right after "Button" so it reads as a pair.
// Its text labels use form-unique keys (like the main button) so they
// aren't carried between forms via copy/paste-style.
secondaryButton:{...secondaryButtonControl,controls:{...secondaryButtonControl.controls,label:undefined,cancelLabel:undefined,[secondaryButtonLabelKey]:secondaryButtonControl.controls.label,[secondaryButtonCancelLabelKey]:secondaryButtonControl.controls.cancelLabel}},gap:basePropertyControls.gap,inputFields:{title:"Inputs",type:ControlType.Object,controls:inputsPropertyControls},link:undefined,onSuccess:basePropertyControls.onSuccess,onError:basePropertyControls.onError};// @ts-ignore - TS doesn't like our basePropertyControls type.
addPropertyControls(Profile,exportBasePropertyControls);Profile.defaultProps={...BaseForm.defaultProps,...Profile.defaultProps};export default Profile;
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"Profile","slots":[],"annotations":{"framerDisableUnlink":"*","framerIntrinsicWidth":"300","framerSupportedLayoutHeight":"any","framerIntrinsicHeight":"40","framerContractVersion":"1","framerSupportedLayoutWidth":"fixed"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./Profile.map