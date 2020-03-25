import React, { useState, useCallback } from 'react';
import { t } from 'ttag';
import cx from 'clsx';
import NavLink from 'components/NavLink';
import GlobalSearch from './GlobalSearch';
import { makeStyles } from '@material-ui/core/styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography,
} from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InfoIcon from '@material-ui/icons/Info';
import { NAVBAR_HEIGHT, TABS_HEIGHT } from 'constants/size';
import { EDITOR_FACEBOOK_GROUP, PROJECT_HACKFOLDR } from 'constants/urls';
import getGravatar from 'lib/getGravatar';

const MENU_BUTTON_WIDTH = 48;

const useStyles = makeStyles(theme => ({
  root: {
    position: 'sticky',
    height: NAVBAR_HEIGHT + TABS_HEIGHT,
    top: 0,
    zIndex: 10,
    '@media(min-width: 992px)': {
      height: NAVBAR_HEIGHT,
    },
  },
  flex: {
    display: 'flex',
  },
  top: {
    height: NAVBAR_HEIGHT,
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    '@media(min-width: 992px)': {
      padding: '0 2rem',
    },
  },
  logo: {
    width: 100,
    height: 'auto',
    '@media(min-width: 992px)': {
      width: 240,
    },
  },
  tabs: {
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    height: TABS_HEIGHT,
    width: `calc(100% - ${MENU_BUTTON_WIDTH}px)`,
    backgroundColor: theme.palette.secondary[50],
    '@media(min-width: 992px)': {
      backgroundColor: 'inherit',
      height: 'auto',
      width: 'auto',
      fontSize: 20,
      padding: '0 10px',
    },
  },
  tab: {
    padding: 8,
    flex: '1',
    lineHeight: `calc(${TABS_HEIGHT}px - 8px * 2)`,
    textAlign: 'center',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    letterSpacing: 0.75,
    color: theme.palette.secondary[300],
    '@media(min-width: 992px)': {
      color: theme.palette.secondary[500],
      padding: '0 10px',
    },
  },
  activeTab: {
    color: theme.palette.secondary[500],
    '@media(min-width: 992px)': {
      color: theme.palette.primary.main,
    },
  },
  menuToggleButton: {
    width: MENU_BUTTON_WIDTH,
    height: TABS_HEIGHT,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.secondary[300],
    color: theme.palette.common.white,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    cursor: 'pointer',
  },
  profileMenu: {
    marginTop: 50,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    overflow: 'inherit',
  },
  level: {
    position: 'relative',
    left: -8,
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.secondary.main,
    padding: '2px 16px',
    '&:after': {
      position: 'absolute',
      right: 0,
      borderRight: `10px solid ${theme.palette.secondary.main}`,
      borderBottom: `10px solid ${theme.palette.primary[500]}`,
      borderTop: `10px solid ${theme.palette.primary[500]}`,
      height: 0,
      content: '""',
    },
    '&:before': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      height: 0,
      borderTop: `8px solid ${theme.palette.primary[700]}`,
      borderLeft: '8px solid transparent',
      background: 'transparent',
      content: '""',
    },
  },
  divider: {
    backgroundColor: theme.palette.secondary[400],
  },
  listIcon: {
    color: theme.palette.secondary[300],
    minWidth: 0,
    paddingRight: 8,
  },
}));

const Links = ({ classes }) => (
  <div className={classes.tabs}>
    <NavLink
      href="/articles"
      className={classes.tab}
      activeClassName={classes.activeTab}
    >
      {t`Collected Messages`}
    </NavLink>
    <NavLink
      href="/replies"
      className={classes.tab}
      activeClassName={classes.activeTab}
    >
      {t`Replies`}
    </NavLink>
    <NavLink
      external
      href={EDITOR_FACEBOOK_GROUP}
      className={cx(classes.tab, 'hidden-xs')}
    >{t`Editor forum`}</NavLink>
    <NavLink
      external
      href={PROJECT_HACKFOLDR}
      className={classes.tab}
    >{t`About`}</NavLink>
  </div>
);

function AppHeader({ onMenuButtonClick, user, openLoginModal, logout }) {
  const [anchor, setAnchor] = useState(false);
  const classes = useStyles();
  const isDesktop = useMediaQuery('(min-width:992px)');

  const openProfileMenu = useCallback(e => setAnchor(e.currentTarget), [
    anchor,
  ]);
  const closeProfileMenu = useCallback(() => setAnchor(null), [anchor]);

  return (
    <header className={classes.root}>
      <div className={classes.top}>
        <div className={classes.flex}>
          <a href="/">
            <img
              className={classes.logo}
              src={isDesktop ? '/logo-desktop.png' : '/logo-mobile.png'}
              alt=""
            />
          </a>
          {isDesktop && <Links classes={classes} />}
        </div>
        <GlobalSearch />
        {isDesktop &&
          (user?.name ? (
            <>
              <img
                className={classes.avatar}
                src={getGravatar(user.email)}
                alt=""
                onClick={openProfileMenu}
              />
              <Menu
                id="profile-menu"
                classes={{ paper: classes.profileMenu }}
                anchorEl={anchor}
                keepMounted
                open={!!anchor}
                onClose={closeProfileMenu}
              >
                <span className={classes.level}>LV. {user.level}</span>
                <MenuItem onClick={closeProfileMenu}>
                  <ListItemIcon>
                    <img
                      className={classes.avatar}
                      src={getGravatar(user.email)}
                      alt=""
                    />
                  </ListItemIcon>
                  <Typography variant="inherit">{user.name}</Typography>
                </MenuItem>
                <Divider classes={{ root: classes.divider }} />
                <MenuItem onClick={closeProfileMenu}>
                  <ListItemIcon className={classes.listIcon}>
                    <AccountCircleOutlinedIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t`My Profile`}</Typography>
                </MenuItem>
                <Divider classes={{ root: classes.divider }} />
                <MenuItem onClick={closeProfileMenu}>
                  <ListItemIcon className={classes.listIcon}>
                    <InfoIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t`About`}</Typography>
                </MenuItem>
                <Divider classes={{ root: classes.divider }} />
                <MenuItem onClick={logout}>
                  <ListItemIcon className={classes.listIcon}>
                    <ExitToAppRoundedIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t`Logout`}</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              onClick={openLoginModal}
              size="small"
              variant="medium"
            >{t`Login`}</Button>
          ))}
      </div>
      {!isDesktop && (
        <div className={classes.flex}>
          <Links classes={classes} />
          <div className={classes.menuToggleButton} onClick={onMenuButtonClick}>
            <MoreHorizIcon />
          </div>
        </div>
      )}
    </header>
  );
}

export default AppHeader;
