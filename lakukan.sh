#!/bin/bash
pacman --noconfirm --needed -Sy \
	base-devel \
	xorg-xinit \
	xorg-server \
	compton \
	arandr \
	noto-fonts \
	rxvt-unicode \
	ntfs-3g \
	dosfstools \
	wireless_tools \
	network-manager-applet \
	networkmnanager
	wpa_supplicant
	gnome-keyring

systemctl enable NetworkManager
systemctl start NetworkManager
	
#video driver
