import fcntl
import struct
import os
from scapy.all import *
from scapy.layers.inet import IP, TCP,ICMP

TUNSETIFF=0x400454ca
IFF_TUN=0x0001
IFF_TAP=0x0002
IFF_NO_PI=0x1000
# create turn interface
tun=os.open('dev/net/tun',os.O_RDWR)
ifr=struct.pack('16sH',b'tun%d',IFF_TUN|IFF_NO_PI)
ifname_bytes=fcntl.ioctl(tun,TUNSETIFF,ifr)
ifname=ifname_bytes.decode('UTF-8')[:16].strip('\x00')
print(f'Interface Name: {ifname}')
# set up the tun interface
os.system("ip addr add 192.168.53.99/24 dev {}".format(ifname))
os.system("ip link set dev {} up".format(ifname))
while True:
    # Get a packet from the tun interface
    packet = os.read(tun, 2048)
    if packet:
        ip = IP(packet)
        print(ip.summary())
        # Send out a spoof packet using the tun interfac
        newip = IP(src='1.2.3.4', dst=ip.src)
        newpkt = newip/ip.payload
        os.write(tun, bytes(newpkt))