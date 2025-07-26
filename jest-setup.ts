import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextDecoder, TextEncoder } from 'util';

global.TextDecoder = TextDecoder as any;
global.TextEncoder = TextEncoder;
