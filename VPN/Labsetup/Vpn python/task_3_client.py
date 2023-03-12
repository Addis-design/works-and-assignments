import fcntl
import struct
import os
from scapy.all import *
from scapy.layers.inet import IP, TCP,ICMP
SERVER_IP='10.9.0.11'
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
os.system("ip addr add 192.168.53.99/24 dev {}".format(ifname))
os.system("ip link set dev {} up".format(ifname))
os.system("ip route add 192.168.60.0/24 dev {} up".format(ifname))
# ceate UDP socket
sock=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
while True:
    # Get a packet from the tun interface
    packet=os.read(tun,2048)
    if True:
         pkt=IP(packet)
         print(pkt.summary())
        #  send the packet via the tunnel
        