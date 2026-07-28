/* Authentication UI. Supabase is enabled only when public values exist in supabase-config.js. */
const config = window.SUPABASE_CONFIG || {};
const configured = Boolean(config.url && config.anonKey && !config.url.includes('YOUR_'));
const $ = (selector) => document.querySelector(selector);
const forms = { login: $('#loginForm'), signup: $('#signupForm'), reset: $('#resetForm') };
const copy = { login:['Bon retour parmi nous',"Connectez-vous pour retrouver votre plan d'entraînement personnalisé."], signup:['Créez votre espace personnel','Suivez votre progression et recevez des recommandations adaptées à votre niveau.'], reset:['Réinitialiser votre mot de passe',''] };
let supabase = null;
function showMessage(text, type='error'){ const box=$('#message'); box.textContent=text;box.className=`message ${type}`;box.hidden=false; }
function setView(view){
  Object.entries(forms).forEach(([name,form])=>form.hidden=name!==view);
  document.querySelectorAll('.tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.view===view));
  $('#formTitle').textContent=copy[view][0]; $('#formLead').textContent=copy[view][1];
  $('.tabs').hidden=view==='reset'; $('#message').hidden=true;
}
async function getClient(){
  if(!configured) return null;
  if(supabase) return supabase;
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  supabase = createClient(config.url, config.anonKey); return supabase;
}
async function requireClient(){ if(!configured){ showMessage("Ajoutez d’abord vos clés publiques Supabase dans supabase-config.js."); return null; } return getClient(); }
async function signIn(event){ event.preventDefault(); const client=await requireClient();if(!client)return;const data=new FormData(event.currentTarget);const {error}=await client.auth.signInWithPassword({email:data.get('email'),password:data.get('password')});if(error)return showMessage(error.message);location.href='index.html'; }
async function signUp(event){ event.preventDefault();const client=await requireClient();if(!client)return;const data=new FormData(event.currentTarget);const firstName=data.get('firstName').trim(),lastName=data.get('lastName').trim();const {error}=await client.auth.signUp({email:data.get('email'),password:data.get('password'),options:{data:{first_name:firstName,last_name:lastName,display_name:`${firstName} ${lastName}`}}});if(error)return showMessage(error.message);showMessage('Compte créé. Vérifiez votre e-mail pour confirmer votre inscription.','success'); }
async function resetPassword(event){ event.preventDefault();const client=await requireClient();if(!client)return;const email=new FormData(event.currentTarget).get('email');const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:new URL('auth.html',location.href).href});if(error)return showMessage(error.message);showMessage('Le lien de réinitialisation a été envoyé.','success'); }
async function social(provider){const client=await requireClient();if(!client)return;const {error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:new URL('index.html',location.href).href}});if(error)showMessage(error.message);}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
document.querySelectorAll('.show-password').forEach(button=>button.addEventListener('click',()=>{const input=button.parentElement.querySelector('input');input.type=input.type==='password'?'text':'password';button.textContent=input.type==='password'?'◉':'◉';}));
forms.login.addEventListener('submit',signIn);forms.signup.addEventListener('submit',signUp);forms.reset.addEventListener('submit',resetPassword);
$('#forgotButton').addEventListener('click',()=>setView('reset'));document.querySelectorAll('.social').forEach(button=>button.addEventListener('click',()=>social(button.dataset.provider)));
$('#demoButton').addEventListener('click',()=>{localStorage.setItem('tcfDemoSession','true');location.href='index.html';});
if(!configured) $('#configNotice').hidden=false;
if(configured){
  getClient().then(async client=>{const {data:{session}}=await client.auth.getSession();if(session) $('#logoutButton').hidden=false;}).catch(()=>showMessage('Impossible de joindre Supabase. Vérifiez la configuration.'));
  $('#logoutButton').addEventListener('click',async()=>{const client=await getClient();await client.auth.signOut();location.reload();});
}
