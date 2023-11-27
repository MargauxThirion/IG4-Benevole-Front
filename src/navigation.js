import PageLogin from "./pages/PageLogin";
import PageAccueil from "./pages/PageAccueil";
import PageRegister from "./pages/PageRegister";


// isMenu : true si on peut voir la page dans le menu sans être connecté
// isPrivate : true si on doit être connecté pour voir la page => doit avoir AuthWrapper.js sur sa page
export const nav = [
    { path : "/", name : "PageLogin", element: <PageLogin />, isMenu: false, isPrivate: false},
    { path : "/accueil", name : "PageAccueil", element: <PageAccueil />, isMenu: true, isPrivate: true},
    {path : "/register", name : "PageRegister", element: <PageRegister />, isMenu: false, isPrivate: false},
]
