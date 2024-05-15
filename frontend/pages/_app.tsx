import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { EthereumSepolia } from '@particle-network/chains';


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthCoreContextProvider
            options={{
                projectId: '38588786-1d5f-4c12-9b3e-2cdef4bd0b2d',
                clientKey: 'ckswNwAnvVCDvoxQm7P4CL8gJjDW8mxSj0mLDkXy',
                appId: 'c0bcb424-a438-400d-bc0d-8c6b8d3ae93c',
                wallet: {
                    visible: true,
                    customStyle: {
                      supportChains: [EthereumSepolia],
                    }
                  },
                  erc4337: {
                    name: 'SIMPLE',
                    version: '1.0.0',
                  },
            }
        }
        >
            <Component {...pageProps} />
        </AuthCoreContextProvider>
    );
}

export default MyApp;
