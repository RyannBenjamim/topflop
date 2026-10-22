import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom"
import Login from "../pages/social/Login/Login";
import SignUp from "../pages/social/SignUp/SignUp";
import VerifyEmail from "../pages/social/VerifyEmail/VerifyEmail";
import ForgotPassword from "../pages/social/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/social/ResetPassword/ResetPassword";
import SocialLayout from "../pages/social/SocialLayout/SocialLayout";
import { requireAuth, requireNoAuth } from "../utils/loaders";

const Home = lazy(() => import("../pages/social/Home/Home"));
const Search = lazy(() => import("../pages/social/Search/Search"));
const MovieDetails = lazy(() => import("../pages/social/MovieDetails/MovieDetails"));
const ExpandedReview = lazy(() => import("../pages/social/ExpandedReview/ExpandedReview"));
const FeedReviews = lazy(() => import("../pages/social/AllReviews/FeedReviews"));
const AllMovieReviews = lazy(() => import("../pages/social/AllReviews/AllMovieReviews"));
const AllUserReviews = lazy(() => import("../pages/social/AllReviews/AllUserReviews"));
const MyList = lazy(() => import("../pages/social/MyList/MyList"));
const Profile = lazy(() => import("../pages/social/Profile/Profile"));
const ProfileReviews = lazy(() => import("../pages/social/Profile/ProfileReviews"));
const ProfileTopFlop = lazy(() => import("../pages/social/Profile/ProfileTopFlop"));
const ProfileList = lazy(() => import("../pages/social/Profile/ProfileList"));
const ProfileFollowers = lazy(() => import("../pages/social/Profile/ProfileFollowers"));
const ProfileFollowing = lazy(() => import("../pages/social/Profile/ProfileFollowing"));
const Community = lazy(() => import("../pages/social/Community/Community"));
const Notifications = lazy(() => import("../pages/social/Notifications/Notifications"));
const Settings = lazy(() => import("../pages/social/Settings/Settings"));
const NotFound = lazy(() => import("../pages/social/NotFound/NotFound"));

const profileTabs = [
  { index: true, element: <ProfileReviews /> },
  { path: 'top-flop', element: <ProfileTopFlop /> },
  { path: 'lista', element: <ProfileList /> },
  { path: 'seguidores', element: <ProfileFollowers /> },
  { path: 'seguindo', element: <ProfileFollowing /> },
]

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
    loader: requireNoAuth
  },
  {
    path: '/cadastro',
    element: <SignUp />,
    loader: requireNoAuth
  },
  {
    path: '/verificar-email',
    element: <VerifyEmail />
  },
  {
    path: '/esqueci-senha',
    element: <ForgotPassword />,
    loader: requireNoAuth
  },
  {
    path: '/redefinir-senha',
    element: <ResetPassword />
  },

  {
    path: '',
    element: <SocialLayout />,
    loader: requireAuth,
    children: [
      { index: true, element: <Home /> },
      { path: 'busca', element: <Search /> },
      { path: 'filmes/:tmdb_id', element: <MovieDetails /> },
      { path: 'filmes/:tmdb_id/reviews', element: <AllMovieReviews /> },
      { path: 'reviews', element: <FeedReviews /> },
      { path: 'reviews/:review_id', element: <ExpandedReview /> },
      { path: 'minha-lista', element: <MyList /> },
      { path: 'perfil', element: <Profile />, children: profileTabs },
      { path: 'perfil/:username', element: <Profile />, children: profileTabs },
      { path: 'perfil/:username/reviews', element: <AllUserReviews /> },
      { path: 'comunidade', element: <Community /> },
      { path: 'notificacoes', element: <Notifications /> },
      { path: 'conta', element: <Settings /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

export default router
