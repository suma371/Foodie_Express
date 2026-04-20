import { motion } from "framer-motion";
import { fadeUp } from "../../utils/motion";

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
