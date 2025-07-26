import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-right: 0px;
  padding-left: 0px;
  width: ${props => (props.width ? `${props.width}` : '100%')};
  align-items: center;
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
