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
    packet=os.read(tun,2048)
    if True:
        pkt=IP(packet)
        print(pkt.summary())
        # send out a spoof packet using the tun interface
        if ICMP in pkt:
            newip=IP(src=pkt[IP].dst,dst=pkt[IP].src)
            newipicmp=ICMP(type=0,id=pkt[ICMP].id,seq=pkt[ICMP].seq)
            newip.ttl=99
            if pkt.haslayer(Raw):
                data=pkt[Raw].load
                newpkt=newip/newipicmp/data
            else:
                newpkt=newip/newipicmp
            os.write(tun,bytes(newpkt))
            
            