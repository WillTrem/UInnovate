import { Typography, Container, Grid } from "@mui/material";
import { NavBar } from "../components/NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { LOGIN_BYPASS } from "../redux/AuthSlice";
export function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      <NavBar />
      <Container
        style={{
          backgroundImage: `url(./../public/home_background.png)`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflowX: "hidden",
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <Typography variant="h2" gutterBottom>
              Welcome to PostGOAT!
            </Typography>
          </Grid>
          <Grid item>
            <img
              src="./../public/PostGOAT_nav.png"
              alt="PostGOAT"
              style={{ maxWidth: "400px", maxHeight: "100%", marginBottom: "20px" }}
            />
          </Grid>
          <Grid item>
            <Typography variant="body1" align="center" paragraph>
              The ultimate platform for handling all your data management needs.
            </Typography>
          </Grid>
          {(user && !LOGIN_BYPASS) && (
            <Grid item>
              <Typography variant="h5" align="center" paragraph>
                Welcome back, {user}! You are logged in.
              </Typography>
              <Typography variant="h7" align="center" paragraph>
                Please select one of the available schemas in the navbar to start browsing your data.
                If there are none present, you might need to refresh your database and reload the page.
              </Typography>
            </Grid>
            
          )}
          {(LOGIN_BYPASS) && (
            <Grid item>
              <Typography variant="h5" align="center" paragraph>
                You currently have login bypass enabled, which means you are a platoform developer. If not, what are you doing here?
              </Typography>
            </Grid>
          )}
          {!user && !LOGIN_BYPASS && (
            <Grid item>
              <Typography variant="h5" align="center" paragraph>
                Please log in to access your databases, or sign up to benefit from all the features of the PostGoat platform.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
