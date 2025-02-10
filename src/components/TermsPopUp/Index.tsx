import React from "react";
import { Box, Typography, Button, Link, Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import styles from "./styles.module.scss";

// Slide-up Transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ open, onClose }) => {
  return (
    <Dialog
    open={open}
    onClose={onClose}
    TransitionComponent={Transition} // Slide-up transition
    PaperProps={{
      style: {
        width: "100%", 
        height: "85%", 
        maxHeight: "85vh", 
        margin: "0 auto", 
        borderRadius: "25px 25px 0 0", 
        position: "absolute",
        bottom: 0, 
      },
    }}
    >
      <Box className={styles["terms-modal"]}>
        {/* Logo */}
        <img
          src="/assets/images/KareraLiveColored.png" // Replace with your logo path
          alt="KareraLive Logo"
          className={styles["logo"]}
        />

        {/* Title */}
        <Typography variant="h6" className={styles["title"]}>
          The following personalities are <strong>NOT ALLOWED</strong> to
          register and/or play in this online gaming website:
        </Typography>

        {/* Terms List */}
        <ul className={styles["terms-list"]}>
          <li>
            Government Official or employee connected directly with the
            operation of the Government or any of its agencies.
          </li>
          <li>
            Member of the Armed Forces of the Philippines, including the Army,
            Navy, Air Force, or the Philippine National Police.
          </li>
          <li>Persons under 21 years of age.</li>
          <li>
            Persons included in the PAGCOR's National Database of Restricted
            Persons (NDRP).
          </li>
          <li>Gaming Employment License (GEL) holder.</li>
        </ul>

        {/* Important Note */}
        <Typography variant="body2" className={styles["important-note"]}>
          Funds or credits in the account of a player who is found ineligible to
          play shall mean forfeiture of said funds/credits in favor of the
          Government.
        </Typography>

        <hr className={styles["divider"]} />

        {/* Links */}
        <Box className={styles["links"]}>
          <Link href="/terms-and-conditions" underline="hover">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" underline="hover">
            Privacy Policy
          </Link>
        </Box>

        {/* Accept Button */}
        <Button
          variant="contained"
          color="success"
          fullWidth
          className={styles["accept-button"]}
          onClick={onClose}
        >
          ACCEPT
        </Button>

        {/* Responsible Gaming Section */}
        <Box className={styles["responsible-gaming"]}>
          <img
            src="/assets/images/pagcor.png" 
            alt="PAGCOR"
          />
        </Box>

        {/* Footer Note */}
        <Typography variant="caption" className={styles["footer-note"]}>
          Please read our{" "}
          <Link href="/responsible-gaming" underline="hover">
            Responsible Gaming
          </Link>{" "}
        </Typography>
        <Typography className={styles["footer-note"]}>
          guidelines carefully.
        </Typography>
      </Box>
    </Dialog>
  );
};
