import { Box, Flex, Heading } from "@chakra-ui/react";
import { LuLogOut, LuMenu, LuUser } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "../constants/routes.ts";
import { useAuth } from "../services/auth/AuthContext.tsx";
import { authService } from "../services/auth/authService.ts";
import ColorToggle from "./ColorToggle.tsx";
import LinkButton from "./LinkButton.tsx";
import NotificationBell from "./NotificationBell.tsx";
import { Button } from "./ui/button.tsx";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu.tsx";

const NavigationBar = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <Flex
      width="100%"
      height="20"
      padding={5}
      alignItems="center"
      justifyContent="space-between"
      borderBottom="1px"
      borderColor="gray.100"
    >
      <Flex alignItems="center" gap={2}>
        <Link to={AppRoute.HOME}>
          <Flex alignItems="center" gap={2}>
            <Heading fontSize={35}>TeachMe</Heading>
          </Flex>
        </Link>
      </Flex>

      <Flex gap={4} alignItems="center">
        {user ? (
          <Flex gap={4}>
            <NotificationBell />
            <Box data-test="menu">
                            <MenuRoot positioning={{placement: "bottom-start"}}>
                                <MenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <LuMenu/>
                                    </Button>
                                </MenuTrigger>
                                <MenuContent>
                                    <MenuItem data-test="menu-profile-option" onClick={() => navigate(AppRoute.PROFILE)}
                                              value="profile" valueText="profile"
                      >                  <LuUser/>
                                        <Box flex="1">Profile</Box>
                                    </MenuItem>
                                    <MenuItem onClick={() => authService.logout()} value="logout" valueText="logout"
                      >                  <LuLogOut/>
                                        <Box flex="1">Logout</Box>
                                    </MenuItem>
                                </MenuContent>
                            </MenuRoot>
                        </Box>
          </Flex>
        ) : (
          <>
            <LinkButton
              as={Link}
              to={AppRoute.LOGIN}
              variant="ghost"
              color="indigo.600"
            >
              Login
            </LinkButton>
            <LinkButton as={Link} to={AppRoute.SIGNUP} colorScheme="indigo">
              Sign up
            </LinkButton>
            <MenuRoot>
              <MenuTrigger asChild>
                <Button size="sm" variant="outline">
                  Swagger Doc
                </Button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem asChild value="auth-service">
                  <a href="/docs/auth-service">Auth Service</a>
                </MenuItem>
                <MenuItem asChild value="student-service">
                  <a href="/docs/student-service">Student Service</a>
                </MenuItem>
                <MenuItem asChild value="course-service">
                  <a href="/docs/course-service">Course Service</a>
                </MenuItem>
                <MenuItem asChild value="rating-service">
                  <a href="/docs/rating-service">Rating Service</a>
                </MenuItem>
                <MenuItem asChild value="certification-service">
                  <a href="/docs/certification-service">
                    Certification Service
                  </a>
                </MenuItem>
                <MenuItem asChild value="forum-service">
                  <a href="/docs/forum-service">Forum Service</a>
                </MenuItem>
                <MenuItem asChild value="notification-service">
                  <a href="/docs/notification-service">Notification Service</a>
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </>
        )}
        <ColorToggle />
      </Flex>
    </Flex>
  );
};

export default NavigationBar;
