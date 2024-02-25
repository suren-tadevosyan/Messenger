import Lottie from "react-lottie";
import notFoundAnim from "../images/noMatches.json";

export const NotFound = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: notFoundAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={130} width={130} />;
};
