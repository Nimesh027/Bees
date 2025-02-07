import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CustomText } from '../commonComponents/CommonComponent';
import { theme } from '../theme/theme';

export const PrivacyPolicy = () => {
  const Styles = useMemo(() => createStyles(theme), [theme]);
  const policyData = [
    {
      title: "Privacy Policy",
      paragraphs: [
        "ItCanada Developer built the Spin Master: Reward Link Spins app as a Free app. This SERVICE is provided by ItCanada Developer at no cost and is intended for use as is.",
        "This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.",
        "If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.",
        "The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which are accessible at Spin Master: Reward Link Spins unless otherwise defined in this Privacy Policy."
      ]
    },
    {
      title: "Information Collection and Use",
      paragraphs: [
        "For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information. The information that we request will be retained by us and used as described in this privacy policy.",
        "The app does use third-party services that may collect information used to identify you."
      ]
    },
    {
      title: "Third-Party Services",
      paragraphs: [
        "Link to the privacy policy of third-party service providers used by the app:"
      ],
      list: [
        "Google Play Services",
        "AdMob",
        "Google Analytics for Firebase",
        "Firebase Crashlytics",
        "Facebook"
      ]
    },
    {
      title: "Log Data",
      paragraphs: [
        "We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third-party products) on your phone called Log Data.",
        "This Log Data may include information such as your device Internet Protocol (\"IP\") address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics."
      ]
    },
    {
      title: "Cookies",
      paragraphs: [
        "Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.",
        "This Service does not use these “cookies” explicitly. However, the app may use third-party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service."
      ]
    },
    {
      title: "Service Providers",
      paragraphs: [
        "We may employ third-party companies and individuals due to the following reasons:",
        "- To facilitate our Service;",
        "- To provide the Service on our behalf;",
        "- To perform Service-related services; or",
        "- To assist us in analyzing how our Service is used.",
        "We want to inform users of this Service that these third parties have access to their Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose."
      ]
    },
    {
      title: "Security",
      paragraphs: [
        "We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security."
      ]
    },
    {
      title: "Links to Other Sites",
      paragraphs: [
        "This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services."
      ]
    },
    {
      title: "Children’s Privacy",
      paragraphs: [
        "These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13 years of age. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers.",
        "If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do the necessary actions."
      ]
    },
    {
      title: "Changes to This Privacy Policy",
      paragraphs: [
        "We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.",
        "This policy is effective as of 2024-03-10."
      ]
    },
    {
      title: "Contact Us",
      paragraphs: [
        "If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at itcanada@info.in."
      ]
    }
  ];

  return (
    <View style={Styles.container}>
      <ScrollView contentContainerStyle={Styles.content}>
        {policyData.map((section, index) => (
          <View key={index}>
            <CustomText title={section.title} style={Styles.subheading} />
            {section.paragraphs.map((paragraph, i) => (
              <CustomText key={i} title={paragraph} style={Styles.bodyText} />
            ))}
            {section.list && section.list.map((item, i) => (
              <CustomText key={i} title={`- ${item}`} style={Styles.listItem} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = ({ text: { subheading, body }, colors: { primary, secondary, accent }, dimensions: { width } }) => {

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: primary,
      padding: width * 0.03,
    },
    content: {
      paddingBottom: 40,
    },
    subheading: {
      fontSize: subheading.fontSize,
      color: accent,
      fontWeight: '600',
      marginTop: width * 0.07,
      marginBottom: width * 0.04,
    },
    bodyText: {
      fontSize: body.fontSize,
      color: secondary,
      lineHeight: 24,
      textAlign: 'justify',
      marginBottom: width * 0.04,
    },
    listItem: {
      fontSize: body.fontSize,
      color: secondary,
      marginLeft: width * 0.04,
      marginBottom: 5,
    },
  });
};
