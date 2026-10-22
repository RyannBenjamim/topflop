import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Center from "../../../components/Center/Center";
import Spinner from "../../../components/Spinner/Spinner";
import { NotificationsProvider } from "../../../context/NotificationsContext";
import { scrollToTop } from "../../../utils/scrollToTop";

const SocialLayout = () => {
  const { pathname, state } = useLocation();
  const keepScroll = (state as { keepScroll?: boolean } | null)?.keepScroll;

  useEffect(() => {
    if (!keepScroll) scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <NotificationsProvider>
      <div className="App">
        <Header />
        <Suspense fallback={<Center><Spinner /></Center>}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
    </NotificationsProvider>
  );
};

export default SocialLayout;
