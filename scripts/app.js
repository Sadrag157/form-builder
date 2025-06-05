import Sidebar from './ui/Sidebar.js';
import Canvas from './ui/canvas/Canvas.js';
import { auth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from './api/firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded and parsed")

    let signInButton = document.getElementById('signInButton');
    let userProfile = document.getElementById('userProfile');
    let userAvatar = document.getElementById('userAvatar');
    let userEmail = document.getElementById('userEmail');
    let signOutButton = document.getElementById('signOutButton');
    const functionalButtons = [
        document.getElementById('addFormZoneButton'),
        document.getElementById('saveFormButton'),
        document.getElementById('ResponseButton'),
        document.getElementById('FormGenerator')
    ];

    let sidebar = null;
    let canvas = null;

    const initAppComponents = () => {
        if (!canvas) {
            canvas = new Canvas();
            console.log("Canvas initialized");
            
            const saveButton = document.getElementById('saveFormButton');
            if (saveButton) {
                saveButton.addEventListener('click', () => {
                    if (canvas) {
                        canvas.saveForm();
                    } else {
                        console.error("Canvas is not initialized");
                    }
                });
            }
        }
        
        if (!sidebar) {
            sidebar = new Sidebar();
            console.log("Sidebar initialized");
        }
    };
    
    function updateAuthUI(user) {
        if (signInButton) {
            signInButton.style.display = user ? 'none' : 'flex';
        }
        
        if (userProfile) {
            userProfile.style.display = user ? 'block' : 'none';
        }
        if (user) {
            if (userAvatar) {
                userAvatar.src = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            }
            if (userEmail) {
                userEmail.textContent = user.email || 'Anonymous User';
            }
            
            functionalButtons.forEach(button => {
                if (button) button.style.display = 'block';
            });
            
            initAppComponents();
        } else {
            functionalButtons.forEach(button => {
                if (button) button.style.display = 'none';
            });
        }
    }

    if (signInButton) {
        signInButton.addEventListener('click', async () => {
            try {
                signInButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                signInButton.disabled = true;
                
                const provider = new GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');

                provider.setCustomParameters({
                    redirect_uri: 'http://localhost:5500'
                });
                
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error('Sign in error:', error);

                let message = 'Sign in failed';
                if (error.code === 'auth/popup-closed-by-user') {
                    message = 'Sign in window was closed';
                } else if (error.code === 'auth/unauthorized-domain') {
                    message = 'Unauthorized domain. Please contact support.';
                }
                
                alert(`${message}: ${error.message}`);

                if (signInButton) {
                    signInButton.innerHTML = '<i class="fab fa-google"></i> Sign In with Google';
                    signInButton.disabled = false;
                }
            }
        });
    }

    const responseButton=document.getElementById('ResponseButton');
    if(responseButton){
        responseButton.addEventListener('click', ()=>{
            window.open('response.html', '_blank');
        });
    }else{
        console.error("button 'ResponseButton' not found");
    }

    const generateLargeFormButton = document.getElementById('FormGenerator');
    if (generateLargeFormButton) {
        generateLargeFormButton.addEventListener('click', async () => {
            console.log("[App.js] 'Generate Large Form' button clicked.");
            if (!canvas || typeof canvas.generateAndAddLargeForm !== 'function') {
                console.error("Generate button: Canvas instance or generateAndAddLargeForm method is not available.");
                generateLargeFormButton.disabled = false;
                return;
            }
                
            generateLargeFormButton.disabled = true;
                
            await canvas.generateAndAddLargeForm(1000); 

            generateLargeFormButton.disabled = false;
        });
    } else {
        console.error("Button 'FormGenerator' not found");
    }


    if (signOutButton) {
        signOutButton.addEventListener('click', async () => {
            try {
                await auth.signOut();
            } catch (error) {
                console.error('Sign out failed:', error);
                alert(`Sign out failed: ${error.message}`);
            }
        });
    }

    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
        
        if (!user && signInButton) {
            signInButton.innerHTML = '<i class="fab fa-google"></i> Sign In with Google';
            signInButton.disabled = false;
        }
    
    });

    updateAuthUI(auth.currentUser);
});