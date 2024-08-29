import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Dialog from '@mui/material/Dialog';
import ExpirationForm from './Services/ExpirationReminder';
import { ExpiringGiftCards } from './Services/ApiCalls';
import { Divider } from '@mui/material';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

interface GiftCard {
  id: string;
  name: string;
  expirationDate: string;
}

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState(0);
  const [giftCards, setGiftCards] = React.useState<GiftCard[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    ExpiringGiftCards()
      .then(expiringCards => {
        setGiftCards(expiringCards);
      })
      .catch(error => {
        console.error('Failed to fetch expiring gift cards:', error);
      });
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const fetchExpiringGiftCards = async () => {
      try {
        const expiringCards = await ExpiringGiftCards();
        setNotifications(expiringCards.length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchExpiringGiftCards();
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Gift Card Manager
          </Typography>
          <Box marginRight={2}>
          <Button
            size="small"
            variant="outlined"
            style={{ color: 'White', borderColor: 'White' }}
            onClick={() => setOpenDialog(true)}
          >
            Change Expiration Reminder
          </Button>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs">
            <ExpirationForm onClose={() => setOpenDialog(false)} />
          </Dialog>

          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Badge
              overlap="circular"
              variant="dot"
              color="error"
              invisible={notifications === 0}
              sx={{ position: 'relative', marginRight: '20px' }}
            >
              <Tooltip title="Expiring Gift Cards">
                <IconButton onClick={handleClickOpenPopover} sx={{ p: 0 }}>
                <NotificationsActiveIcon style={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </Badge>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Box sx={{ p: 2 }}>
              {giftCards.length > 0 ? (
                  giftCards.map((giftCard, index) => {
                    const expirationDate = new Date(giftCard.expirationDate);
                    const currentDate = new Date();
                    const diffTime = Math.abs(expirationDate.getTime() - currentDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                    return (
                      <React.Fragment key={giftCard.id}>
                        <Typography variant="body2">
                          {giftCard.name} - Expiring in: {diffDays} days
                        </Typography>
                        {index < giftCards.length - 1 && <Divider />}  {/* Don't render a divider after the last item */}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <Typography variant="body2">No expiring gift cards</Typography>
                )}
              </Box>
            </Popover>

            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
