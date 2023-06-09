import React, { useContext, useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { IconContext } from 'react-icons';
import { IoCopyOutline, IoLogOutOutline, IoWalletOutline } from 'react-icons/all';
import { SeiWalletContext } from '../../provider';
import { WalletSelectModal } from '../WalletSelectModal';
import { WalletConnectButtonProps } from './types';
import './styles.css';
import { isValidCSSColor } from '../../utils';

export const truncateAddress = (address: string) => `${address.slice(0, 3)}....${address.slice(address.length - 5)}`;

const WalletConnectButton = ({ buttonClassName, wallets: inputWallets, primaryColor, secondaryColor, backgroundColor }: WalletConnectButtonProps) => {
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [recentlyCopied, setRecentlyCopied] = useState<boolean>(false);

	const { connectedWallet, accounts, setTargetWallet, wallets, showConnectModal, setShowConnectModal } = useContext(SeiWalletContext);

	useEffect(() => {
		const color = primaryColor && isValidCSSColor(primaryColor) ? primaryColor : '#121212';
		document.documentElement.style.setProperty('--wallet-primary-color', color);
		document.documentElement.style.setProperty('--wallet-primary-color-11', `${color}11`);
		document.documentElement.style.setProperty('--wallet-primary-color-22', `${color}22`);
		document.documentElement.style.setProperty('--wallet-primary-color-33', `${color}33`);
		document.documentElement.style.setProperty('--wallet-primary-color-44', `${color}44`);
	}, [primaryColor]);

	useEffect(() => {
		const color = secondaryColor && isValidCSSColor(secondaryColor) ? secondaryColor : '#8C8C8C';
		document.documentElement.style.setProperty('--wallet-secondary-color', color);
	}, [secondaryColor]);

	useEffect(() => {
		const color = backgroundColor && isValidCSSColor(backgroundColor) ? backgroundColor : '#F1F1F1';
		document.documentElement.style.setProperty('--wallet-background-color', color);
	}, [backgroundColor]);

	const changeWallet = () => {
		setShowConnectModal(true);
		setShowMenu(false);
	};

	const copyAddress = async () => {
		setRecentlyCopied(true);
		await navigator.clipboard.writeText(accounts?.[0]?.address);
		setTimeout(() => {
			setRecentlyCopied(false);
		}, 1500);
	};

	const disconnect = () => {
		if (setTargetWallet) setTargetWallet(undefined);
	};

	const renderButton = () => {
		if (!connectedWallet) {
			return (
				<button className={buttonClassName} onClick={() => setShowConnectModal(true)}>
					connect wallet
				</button>
			);
		}

		const accountLabel = accounts?.[0] === undefined ? 'connecting...' : truncateAddress(accounts[0].address);

		return (
			<div className='connect_wrapper'>
				<button disabled={showMenu} className={buttonClassName} onClick={() => setShowMenu(true)}>
					{accountLabel}
				</button>
				{showMenu && (
					<OutsideClickHandler onOutsideClick={() => setShowMenu(false)}>
						<div className='wallet__menu'>
							{accounts && (
								<div className='wallet__menu--item' onClick={copyAddress}>
									<IoCopyOutline className='wallet__menu--item-icon' />
									<span>{recentlyCopied ? 'copied' : 'copy address'}</span>
								</div>
							)}
							<div className='wallet__menu--item' onClick={changeWallet}>
								<IoWalletOutline className='wallet__menu--item-icon' />
								<span>change wallet</span>
							</div>
							<div className='wallet__menu--item' onClick={disconnect}>
								<IoLogOutOutline className='wallet__menu--item-icon' />
								<span>disconnect</span>
							</div>
						</div>
					</OutsideClickHandler>
				)}
			</div>
		);
	};

	return (
		<>
			<IconContext.Provider value={{ color: 'var(--wallet-primary-color)', size: '50px' }}>
				{renderButton()}
				{showConnectModal && <WalletSelectModal wallets={inputWallets || wallets} setShowConnectModal={setShowConnectModal} />}
			</IconContext.Provider>
		</>
	);
};

export default WalletConnectButton;
