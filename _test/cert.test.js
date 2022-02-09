//---------------------------------------------------------------------------
// The following are test certs....
//---------------------------------------------------------------------------
test1();
test2();
test3();
//test4();
test5();
test6();

//---------------------------------------------------------------------------
// tls cert w/o alt subjects
//---------------------------------------------------------------------------
function test1() {
	const tls_root_cert = 
`-----BEGIN CERTIFICATE-----
MIIFgjCCA2qgAwIBAgILWku9WvtPilv6ZeUwDQYJKoZIhvcNAQELBQAwTTELMAkG
A1UEBhMCQVQxIzAhBgNVBAoTGmUtY29tbWVyY2UgbW9uaXRvcmluZyBHbWJIMRkw
FwYDVQQDExBHTE9CQUxUUlVTVCAyMDIwMB4XDTIwMDIxMDAwMDAwMFoXDTQwMDYx
MDAwMDAwMFowTTELMAkGA1UEBhMCQVQxIzAhBgNVBAoTGmUtY29tbWVyY2UgbW9u
aXRvcmluZyBHbWJIMRkwFwYDVQQDExBHTE9CQUxUUlVTVCAyMDIwMIICIjANBgkq
hkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAri5WrRsc7/aVj6B3GyvTY4+ETUWiD59b
RatZe1E0+eyLinjF3WuvvcTfk0Uev5E4C64OFudBc/jbu9G4UeDLgztzOG53ig9Z
YybNpyrOVPu44sB8R85gfD+yc/LAGbaKkoc1DZAoouQVBGM+uq/ufF7MpotQsjj3
QWPKzv9pj2gOlTblzLmMCcpL3TGQlsjMH/1WljTbjhzqLL6FLmPdqqmV0/0plRPw
yJiT2S0WR5ARg6I6IqIoV6Lr/sCMKKCmfecqQjuCgGOlYx8ZzHyyZqjC0203b+J+
BlHZRYQfEs4kUmSFC0iAToexIiIwquuuvuAC4EDosEKAA1GqtH6qRNdDYfOiaxaJ
SaSjpCuKAsR49GiKweR6NrFvG5Ybd0mN1MkGco/PU+PcF4UgStyYJ9ORJitHHmkH
r96i5OTUawuzXnzUJIBHKWk7buis/UDr2O1xcSvy6Fgd60GXIsUf1DnQJ4+H4xj0
4KlGDfV0OoIu0G4skaMxXDtG6nsEEFZegB31pWXogvziB4xiRfUg3kZwhqG8k9Me
dKZssCz3AwyIDMvUclOGvGBG85hqwvG/Q/lwIHfKN0F5VVJjjVsSn8VoxIidrPIw
q7ejMZdnrY8XD2zHc+0klGvIg5rQmjdJBKuxFshsSUktq6HQjJLyQUp5ISXbY9e2
nKd+Qmn7OmMCAwEAAaNjMGEwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AQYwHQYDVR0OBBYEFNwuH9FhN3nkq9XVsxJxaD1qaJwiMB8GA1UdIwQYMBaAFNwu
H9FhN3nkq9XVsxJxaD1qaJwiMA0GCSqGSIb3DQEBCwUAA4ICAQCR8EICaEDuw2jA
VC/f7GLDw56KoDEoqoOOpFaWEhCGVrqXctJUMHytGdUdaG/7FELYjQ7ztdGl4wJC
XtzoRlgHNQIw4Lx0SsFDKv/bGtCwr2zD/cuz9X9tAy5ZVp0tLTWMstZDFyySCstd
6IwPS3BD0IL/qMy/pJTAvoe9iuOTe8aPmxadJ2W8esVCgmxcB9CpwYhgROmYhRZf
+I/KARDOJcP5YBugxZfD0yyIMaK9MOzQ0MAS8cE54+X1+NZK3TTN+2/BT+MAi1bi
kvcoskJ3ciNnxz8RFbLEAwW+uxF7Cr+obuf/WEPPm2eggAe2HcqtbepBEX4tdJP7
wry+UUTF72glJ4DjyKDUEuzZpTcdN3y0kcra1LGWge9oXHYQSa9+pTeAsRxSvTOB
TI/53WXZFM2KJVj04sWDpQmQ1GwUY7VA3+vA/MRYfg0UFodUJ25W5HCEuGwyEn6C
MUO+1918oa2u1qsgEu8KwxCMSZY13At1XrFP1U80DhEgB3VDRemjEdqso5nCtnkn
4rnvyOL2NSl6dPrFf4IFYqYK6miyeUcGbvJXqBUzxvd4Sj1Ce2t+/vdG6tHrju+I
aFvowdlxfv1k7/9nR4hYJS8+hge9+6jlgqispdNpQ80xiEmEU5LAsTkbOYMBMMTy
qfrQA71yN2BWHzZ8vTmR9W0Nv3vXkg==
-----END CERTIFICATE-----`;
	const resp = decodeAsn1(tls_root_cert);
	const correct =
`
# Serial: 05A4BBD5AFB4F8A5BFA65E5
# countryName: AT
# organizationName: e-commerce monitoring GmbH
# commonName: GLOBALTRUST 2020
# notBefore: 2020-02-10 00:00:00 UTC
# notAfter: 2040-06-10 00:00:00 UTC
# countryName: AT
# organizationName: e-commerce monitoring GmbH
# commonName: GLOBALTRUST 2020
# basicConstraints: true
# keyUsage: true
# subjectKeyIdentifier: DC2E1FD1613779E4ABD5D5B31271683D6A689C22
# authorityKeyIdentifier: DC2E1FD1613779E4ABD5D5B31271683D6A689C22
${tls_root_cert}`;

	if (resp === correct) {
		console.log('test1 - good');
	} else {
		console.log('test1 - bad', correct.length, resp.length);
	}
}

//---------------------------------------------------------------------------
// tls cert with alt subjects
//---------------------------------------------------------------------------
function test2() {
	const tls_root_cert_alt_subjects = 
`-----BEGIN CERTIFICATE-----
MIIFOjCCBCKgAwIBAgISBCdVASalHOGJqcxB/PyuLfhVMA0GCSqGSIb3DQEBCwUA
MDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQD
EwJSMzAeFw0yMTEyMjAxMDUzNDVaFw0yMjAzMjAxMDUzNDRaMB0xGzAZBgNVBAMT
End3dy5zc2xzaG9wcGVyLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAOeUPEKWMtfvATZk40OwJ/FR1YQtvwQhWACVG7Kd7HiGdDDF4cF0qCnd6hSq
wAm2c6g+fTgsU44uRXwO09s99sk9jCpHrCERA3Ii2OzCaB/8nCHzykFdvHbsrzQo
yDQRJTjkgnnNl/SMyoTQs3iAC60Jctx2W7U+2ERP9wB39dw/hn7ULYeNGHuI+oFT
mEfK+FznApHycYks0eN4oe8bMsVsv5vdsOFdi0JlYogPWwROZDws1m4v0Hb00xPU
hmKXrjhdV7MZVRFsxR25ZaOWYfFl6sUuiAdEeZbojvKo20qBW9u/xGyJWAX8IvCM
ukpD+ZTLR9LbHhC/q21bCOCRusECAwEAAaOCAl0wggJZMA4GA1UdDwEB/wQEAwIF
oDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAd
BgNVHQ4EFgQU8/YpW7l2tkkMlTObbLmehFSPupYwHwYDVR0jBBgwFoAUFC6zF7dY
VsuuUAlA5h+vnYsUwsYwVQYIKwYBBQUHAQEESTBHMCEGCCsGAQUFBzABhhVodHRw
Oi8vcjMuby5sZW5jci5vcmcwIgYIKwYBBQUHMAKGFmh0dHA6Ly9yMy5pLmxlbmNy
Lm9yZy8wLQYDVR0RBCYwJIIOc3Nsc2hvcHBlci5jb22CEnd3dy5zc2xzaG9wcGVy
LmNvbTBMBgNVHSAERTBDMAgGBmeBDAECATA3BgsrBgEEAYLfEwEBATAoMCYGCCsG
AQUFBwIBFhpodHRwOi8vY3BzLmxldHNlbmNyeXB0Lm9yZzCCAQQGCisGAQQB1nkC
BAIEgfUEgfIA8AB2AG9Tdqwx8DEZ2JkApFEV/3cVHBHZAsEAKQaNsgiaN9kTAAAB
fdewxUcAAAQDAEcwRQIhAPAWpnoO8teE/UeWRPOEtjQZzYVJR91Jm5SPgqM4duRt
AiAeUDKCyM4ZQiKBbQZdzAHgtYYagcdPIuLV4aRkgksocQB2AEalVet1+pEgMLWi
iWn0830RLEF0vv1JuIWr8vxw/m1HAAABfdewxU8AAAQDAEcwRQIhAIKKuoeD+d6b
PXg3JPeeC+sd3Pass2Vo4ppn6BsoW3L/AiAA3V+/xe6wUqt9TL2FL+6TvYVjFFEQ
iaFKAlO892tRJzANBgkqhkiG9w0BAQsFAAOCAQEAp/FN/TlUN3U8/6o+imqJoWAD
YNAigaODkmg+O4mTQBC+lxR3Q33E30d6wjd6CFEyd0QDirZAeTRnCWuXbh9wC0PO
pBJISQf/mt+aa7RXYETnD8TgKuGikcMzGI6iujIxaMz8iUL+HKOuH37Y00K1CPAc
jrCFxW5xvUtOx3BxdNrO05RIRpmGyK+ANHIVKh5Ts9AC3elWZE1EceSvnnCEhSJ1
uU9mgeCrxP/A8n87+wcREGq3E5OK7sKTJhl2mhYR0Lozj9npqdQovEzC2JwwjUpB
mTFULObr1tETjRzYgLATL5urd4OnYH+rzEaRq/Xzxsm2/IB5N2Rm8ageXIpxNA==
-----END CERTIFICATE-----`;
	const resp = decodeAsn1(tls_root_cert_alt_subjects);
	const correct =
`
# Serial: 0427550126A51CE189A9CC41FCFCAE2DF855
# countryName: US
# organizationName: Let's Encrypt
# commonName: R3
# notBefore: 2021-12-20 10:53:45 UTC
# notAfter: 2022-03-20 10:53:44 UTC
# commonName: www.sslshopper.com
# keyUsage: true
# extKeyUsage:, serverAuth, clientAuth
# basicConstraints: true
# subjectKeyIdentifier: F3F6295BB976B6490C95339B6CB99E84548FBA96
# authorityKeyIdentifier: 142EB317B75856CBAE500940E61FAF9D8B14C2C6
# authorityInfoAccess:, ocsp, http://r3.o.lencr.org, caIssuers, http://r3.i.lencr.org/
# subjectAltName:, sslshopper.com, www.sslshopper.com
# certificatePolicies:, 2.23.140.1.2.1, 1.3.6.1.4.1.44947.1.1.1, cps, http://cps.letsencrypt.org
${tls_root_cert_alt_subjects}`;

	if (resp === correct) {
		console.log('test2 - good');
	} else {
		console.log('test2 - bad', correct.length, resp.length, resp);
	}
}

//---------------------------------------------------------------------------
// tls cert with alt subjects
//---------------------------------------------------------------------------
function test3() {
	const tls_root_cert_curveEd25519 = 
`-----BEGIN CERTIFICATE-----
MIIBfzCCATGgAwIBAgIUfI5kSdcO2S0+LkpdL3b2VUJG10YwBQYDK2VwMDUxCzAJ
BgNVBAYTAklUMQ8wDQYDVQQHDAZNaWxhbm8xFTATBgNVBAMMDFRlc3QgZWQyNTUx
OTAeFw0yMDA5MDIxMzI1MjZaFw0zMDA5MDIxMzI1MjZaMDUxCzAJBgNVBAYTAklU
MQ8wDQYDVQQHDAZNaWxhbm8xFTATBgNVBAMMDFRlc3QgZWQyNTUxOTAqMAUGAytl
cAMhADupL/3LF2beQKKS95PeMPgKI6gxIV3QB9hjJC7/aCGFo1MwUTAdBgNVHQ4E
FgQUa6W9z536I1l4EmQXrh5y2JqASugwHwYDVR0jBBgwFoAUa6W9z536I1l4EmQX
rh5y2JqASugwDwYDVR0TAQH/BAUwAwEB/zAFBgMrZXADQQBvc3e+KJZaMzbX5TT9
kPP9QH8fAvkAV/IWDxZrBL9lhLaY0tDSv0zWbw624uidBKPgmVD5wm3ec60dNVeF
ZYYG
-----END CERTIFICATE-----`;
	const resp = decodeAsn1(tls_root_cert_curveEd25519);
	const correct =
`
# Serial: 07C8E6449D70ED92D3E2E4A5D2F76F6554246D746
# curveEd25519: --
# countryName: IT
# localityName: Milano
# commonName: Test ed25519
# notBefore: 2020-09-02 13:25:26 UTC
# notAfter: 2030-09-02 13:25:26 UTC
# countryName: IT
# localityName: Milano
# commonName: Test ed25519
# curveEd25519: --
# subjectKeyIdentifier: 6BA5BDCF9DFA235978126417AE1E72D89A804AE8
# authorityKeyIdentifier: 6BA5BDCF9DFA235978126417AE1E72D89A804AE8
# basicConstraints: true
# curveEd25519: --
${tls_root_cert_curveEd25519}`;

	if (resp === correct) {
		console.log('test3 - good');
	} else {
		console.log('test3 - bad', correct.length, resp.length, resp);
	}
}

//---------------------------------------------------------------------------
// let's encrypt tls cert
//---------------------------------------------------------------------------
function test5() {
	const tls_root_encrypt = 
`-----BEGIN CERTIFICATE-----
MIIEkjCCA3qgAwIBAgIQCgFBQgAAAVOFc2oLheynCDANBgkqhkiG9w0BAQsFADA/
MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT
DkRTVCBSb290IENBIFgzMB4XDTE2MDMxNzE2NDA0NloXDTIxMDMxNzE2NDA0Nlow
SjELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUxldCdzIEVuY3J5cHQxIzAhBgNVBAMT
GkxldCdzIEVuY3J5cHQgQXV0aG9yaXR5IFgzMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEAnNMM8FrlLke3cl03g7NoYzDq1zUmGSXhvb418XCSL7e4S0EF
q6meNQhY7LEqxGiHC6PjdeTm86dicbp5gWAf15Gan/PQeGdxyGkOlZHP/uaZ6WA8
SMx+yk13EiSdRxta67nsHjcAHJyse6cF6s5K671B5TaYucv9bTyWaN8jKkKQDIZ0
Z8h/pZq4UmEUEz9l6YKHy9v6Dlb2honzhT+Xhq+w3Brvaw2VFn3EK6BlspkENnWA
a6xK8xuQSXgvopZPKiAlKQTGdMDQMc2PMTiVFrqoM7hD8bEfwzB/onkxEz0tNvjj
/PIzark5McWvxI0NHWQWM6r6hCm21AvA2H3DkwIDAQABo4IBfTCCAXkwEgYDVR0T
AQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAYYwfwYIKwYBBQUHAQEEczBxMDIG
CCsGAQUFBzABhiZodHRwOi8vaXNyZy50cnVzdGlkLm9jc3AuaWRlbnRydXN0LmNv
bTA7BggrBgEFBQcwAoYvaHR0cDovL2FwcHMuaWRlbnRydXN0LmNvbS9yb290cy9k
c3Ryb290Y2F4My5wN2MwHwYDVR0jBBgwFoAUxKexpHsscfrb4UuQdf/EFWCFiRAw
VAYDVR0gBE0wSzAIBgZngQwBAgEwPwYLKwYBBAGC3xMBAQEwMDAuBggrBgEFBQcC
ARYiaHR0cDovL2Nwcy5yb290LXgxLmxldHNlbmNyeXB0Lm9yZzA8BgNVHR8ENTAz
MDGgL6AthitodHRwOi8vY3JsLmlkZW50cnVzdC5jb20vRFNUUk9PVENBWDNDUkwu
Y3JsMB0GA1UdDgQWBBSoSmpjBH3duubRObemRWXv86jsoTANBgkqhkiG9w0BAQsF
AAOCAQEA3TPXEfNjWDjdGBX7CVW+dla5cEilaUcne8IkCJLxWh9KEik3JHRRHGJo
uM2VcGfl96S8TihRzZvoroed6ti6WqEBmtzw3Wodatg+VyOeph4EYpr/1wXKtx8/
wApIvJSwtmVi4MFU5aMqrSDE6ea73Mj2tcMyo5jMd6jmeWUHK8so/joWUoHOUgwu
X4Po1QYz+3dszkDqMp4fklxBwXRsW10KXzPMTZ+sOPAveyxindmjkW8lGy+QsRlG
PfZ+G6Z6h7mjem0Y+iWlkYcV4PIWL1iwBi8saCbGS5jN2p8M+X+Q7UNKEkROb3N6
KOqkqm57TH2H3eDJAkSnh6/DNFu0Qg==
-----END CERTIFICATE-----`;
	const resp = decodeAsn1(tls_root_encrypt);
	const correct =
`
# Serial: 0A0141420000015385736A0B85ECA708
# organizationName: Digital Signature Trust Co.
# commonName: DST Root CA X3
# notBefore: 2016-03-17 16:40:46 UTC
# notAfter: 2021-03-17 16:40:46 UTC
# countryName: US
# organizationName: Let's Encrypt
# commonName: Let's Encrypt Authority X3
# basicConstraints: true
# keyUsage: true
# authorityInfoAccess:, ocsp, http://isrg.trustid.ocsp.identrust.com, caIssuers, http://apps.identrust.com/roots/dstrootcax3.p7c
# authorityKeyIdentifier: C4A7B1A47B2C71FADBE14B9075FFC41560858910
# certificatePolicies:, 2.23.140.1.2.1, 1.3.6.1.4.1.44947.1.1.1, cps, http://cps.root-x1.letsencrypt.org
# cRLDistributionPoints: http://crl.identrust.com/DSTROOTCAX3CRL.crl
# subjectKeyIdentifier: A84A6A63047DDDBAE6D139B7A64565EFF3A8ECA1
${tls_root_encrypt}`;

	if (resp === correct) {
		console.log('test5 - good');
	} else {
		console.log('test5 - bad', correct.length, resp.length, resp);
	}
}

//---------------------------------------------------------------------------
// let's encrypt tls cert
//---------------------------------------------------------------------------
function test6() {
	const pub_cert_ibp = 
`-----BEGIN CERTIFICATE-----
MIIB5TCCAYugAwIBAgIUeki3wjpNDSPcrlnWAC2l4a3hProwCgYIKoZIzj0EAwIw
RTEoMAkGA1UECxMCY2EwCgYDVQQLEwNpYnAwDwYDVQQLEwhQZWVyT3JnMjEZMBcG
A1UEAxMQYWRtaW5QZWVyT3JnMkNBMTAeFw0xODA5MTcwMzAwMDBaFw0xOTA5MTcw
MzA1MDBaMD4xLDANBgNVBAsTBmNsaWVudDAKBgNVBAsTA2licDAPBgNVBAsTCFBl
ZXJPcmcyMQ4wDAYDVQQDEwVhZG1pbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IA
BIqmrkgPa9LTSe6BlUrPYPM5bXVYIMJBQZmAHDlgPBrUxIC37YPBfcX8WQFZhTqv
37jeJmzx9/XF2WEpt8VfkeOjYDBeMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8E
AjAAMB0GA1UdDgQWBBTPz3sNmLYsfn6uHsy727m1rKVFczAfBgNVHSMEGDAWgBQH
aNByMO0q/vqxWmjfdAr38LuYUTAKBggqhkjOPQQDAgNIADBFAiEAqjnZ9n7y+LCd
wno9hn1LHYAWJNjqcd6z4gP+NtMaAIYCIFfLT0d482WdOmHxCcqu88ljmeGYCSfS
nDgMLtxQnCIQ
-----END CERTIFICATE-----`;
	const resp = decodeAsn1(pub_cert_ibp);
	const correct =
`
# Serial: 07A48B7C23A4D0D23DCAE59D6002DA5E1ADE13EBA
# ecdsaWithSHA256: --
# organizationalUnitName: ca
# organizationalUnitName: ibp
# organizationalUnitName: PeerOrg2
# commonName: adminPeerOrg2CA1
# notBefore: 2018-09-17 03:00:00 UTC
# notAfter: 2019-09-17 03:05:00 UTC
# organizationalUnitName: client
# organizationalUnitName: ibp
# organizationalUnitName: PeerOrg2
# commonName: admin
# ecPublicKey: prime256v1
# keyUsage: true
# basicConstraints: true
# subjectKeyIdentifier: CFCF7B0D98B62C7E7EAE1ECCBBDBB9B5ACA54573
# authorityKeyIdentifier: 0768D07230ED2AFEFAB15A68DF740AF7F0BB9851
# ecdsaWithSHA256: --
# Serial: 0AA39D9F67EF2F8B09DC27A3D867D4B1D801624D8EA71DEB3E203FE36D31A0086
# Serial: 057CB4F4778F3659D3A61F109CAAEF3C96399E1980927D29C380C2EDC509C2210
${pub_cert_ibp}`;

	if (resp === correct) {
		console.log('test6 - good');
	} else {
		console.log('test6 - bad', correct.length, resp.length, resp);
	}
}