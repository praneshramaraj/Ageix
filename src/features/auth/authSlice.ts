import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserProfile, UserRole, LoginCredentials, ROLE_PERMISSIONS } from '../../types/auth';

const INITIAL_USER: UserProfile = {
  id: 'usr_commander_01',
  email: 'commander@aegisx.gov',
  username: 'cmd_vance',
  fullName: 'Commander Alex Vance',
  role: 'Disaster Commander',
  department: 'HQ Emergency Command Center',
  callsign: 'ALPHA-1',
  badgeNumber: 'AGX-9001',
};

const initialState: AuthState = {
  user: INITIAL_USER,
  token: 'mock_aegisx_jwt_token_active',
  refreshToken: 'mock_aegisx_jwt_refresh_active',
  isAuthenticated: true,
  rememberMe: true,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: UserProfile; token: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    switchRole: (state, action: PayloadAction<UserRole>) => {
      if (!state.user) return;
      const role = action.payload;
      let email = 'commander@aegisx.gov';
      let fullName = 'Commander Alex Vance';
      let department = 'HQ Emergency Command Center';
      let callsign = 'ALPHA-1';

      if (role === 'Administrator') {
        email = 'admin@aegisx.gov';
        fullName = 'Director Elena Rostova';
        department = 'Global EOC Systems';
        callsign = 'OVERLORD-1';
      } else if (role === 'Dispatcher') {
        email = 'dispatcher@aegisx.gov';
        fullName = 'Officer Marcus Brody';
        department = 'Metro 911 Dispatch Hub';
        callsign = 'DISPATCH-9';
      } else if (role === 'Rescue Team Leader') {
        email = 'rescuer@aegisx.gov';
        fullName = 'Captain Sarah Jenkins';
        department = 'Tactical Rescue Squad 4';
        callsign = 'RESCUE-4';
      } else if (role === 'Field Officer') {
        email = 'field@aegisx.gov';
        fullName = 'Officer David Miller';
        department = 'Coastal Field Unit';
        callsign = 'FIELD-12';
      } else if (role === 'Viewer') {
        email = 'viewer@aegisx.gov';
        fullName = 'Observer Taylor Swift';
        department = 'Public Media Desk';
        callsign = 'VIEWER-0';
      }

      state.user = {
        ...state.user,
        role,
        email,
        fullName,
        department,
        callsign,
      };
    },
  },
});

export const { setLoading, loginSuccess, logout, switchRole } = authSlice.actions;
export default authSlice.reducer;
