import { AccountStatus, FullUser, User } from "@/types/entity";
import { analyzeRisk } from "@/utils/userRiskAnalyzer";
import { fetchAllUsers } from "@/utils/users";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = React.useState<FullUser[]>([]);
    const [criticalUsers, setCriticalUsers] = React.useState<FullUser[]>([]);

    const [userCount, setUserCount] = React.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [totalUsers, setTotalUsers] = React.useState(0);
    const [activeUsers, setActiveUsers] = React.useState(0);

    const currentMonth = new Date().getMonth(); // 0-11

    // first half of year
    const firstHalfLabels = labels.slice(0, 6);
    const firstHalfData = userCount.slice(0, 6);

    // second half of year
    const secondHalfLabels = labels.slice(6, 12);
    const secondHalfData = userCount.slice(6, 12);

    // choose which half to show
    const chartLabels = currentMonth < 6 ? firstHalfLabels : secondHalfLabels;
    const chartData = currentMonth < 6 ? firstHalfData : secondHalfData;
    

    const load = async () => {
      const userRes = await fetchAllUsers();
      setUsers(userRes);
      getUsersCount(userRes);
      getCriticalUsers();
    };

    useEffect(() => {
        load();
    }, [])

    const getUsersCount = (usersData: FullUser[]) => {
      const currentYear = new Date().getFullYear();

      const monthlyCounts = Array(12).fill(0);

      const filteredUsers = usersData
        .filter((item) => item.user.role === "USER")
        .map((item) => item.user);

      filteredUsers.forEach((user) => {
        if (!user.createdAt) return;

        const date = new Date(user.createdAt);

        if (date.getFullYear() === currentYear) {
          const month = date.getMonth();
          monthlyCounts[month]++;
        }
      });

      setTotalUsers(filteredUsers.filter((user) => user.role === "USER").length);
      setActiveUsers(filteredUsers.filter((user) => user.accountStatus === AccountStatus.ACTIVE && user.role === "USER").length);
      setUserCount(monthlyCounts);
    };

    const getCriticalUsers = () => {
      const risky = users
        .filter(
          (item) =>
            analyzeRisk(item.assets, item.liabilities).riskLevel.label ===
            "High Risk"
        )
      setCriticalUsers(risky);
    };

    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Admin Control Center</Text>
          <Text style={styles.heroSub}>
            Real-time system overview & risk intelligence
          </Text>
        </View>

        {/* KPI STRIP */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.kpiRow}
        >
          <KPI title="Total Users" value={totalUsers} />
          <KPI title="Active Today" value={activeUsers} />
          <KPI title="High Risk" value={criticalUsers?.length} danger/>
        </ScrollView>

        {/* AI INSIGHT */}
        {criticalUsers?.length > 0 && (
            <View style={styles.aiCard}>
                <Text style={styles.aiTitle}>AI Risk Insight</Text>
                <Text style={styles.aiText}>
                    ⚠️ {criticalUsers?.length} users crossed the safe debt threshold this month.
                    {"\n"}AI suggests proactive alerts to prevent defaults.
                </Text>

                <TouchableOpacity
                    onPress={() => {
                    router.push("/risk");
                    }}
                    style={styles.aiBtn}
                >
                    <Text style={styles.aiBtnText}>View High-Risk Users</Text>
                </TouchableOpacity>
            </View>
        )}

        {/* GROWTH CHART */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Growth Trend</Text>

          <LineChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartData }],
            }}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* HIGH RISK USERS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Critical Risk Users</Text>

          {criticalUsers.length === 0 ? (
            <View style={styles.safeBox}>
              <Text style={styles.safeIcon}>🟢</Text>
              <Text style={styles.safeTitle}>
                No Financially Unhealthy Users
              </Text>
              <Text style={styles.safeSub}>
                No users currently exceed the critical debt ratio threshold.
              </Text>
            </View>
          ) : (
            criticalUsers.map((u, i) => {
              const risk = analyzeRisk(u.assets, u.liabilities);

              return (
                <View key={i} style={styles.userRow}>
                  <View>
                    <Text style={styles.userEmail}>{u.user.email}</Text>
                    <Text style={styles.userSub}>
                      Debt Ratio {risk.emiRatio}%
                    </Text>
                  </View>
                  <Text style={styles.critical}>CRITICAL</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    );
}

/* ---------- COMPONENTS ---------- */

const KPI = ({ title, value, trend, danger }: any) => (
    <View style={[styles.kpiCard, danger && styles.kpiDanger]}>
        <Text style={styles.kpiTitle}>{title}</Text>
        <Text
            style={[
                styles.kpiValue,
                danger && { color: "#ff6b6b" },
            ]}
        >
            {value}
        </Text>
        {trend && <Text style={styles.kpiTrend}>{trend}</Text>}
    </View>
);

/* ---------- CHART CONFIG ---------- */

const chartConfig = {
    backgroundGradientFrom: "#071013",
    backgroundGradientTo: "#071013",
    color: (opacity = 1) => `rgba(0,212,138,${opacity})`,
    labelColor: () => "#9aa8a6",
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#00d48a",
    },
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#071013",
    padding: 20,
  },

  hero: {
    marginBottom: 24,
    marginLeft: 30,
    marginTop: 30,
  },

  heroTitle: {
    color: "#e5fff6",
    fontSize: 24,
    fontWeight: "900",
  },

  heroSub: {
    color: "#9aa8a6",
    marginTop: 4,
    fontSize: 13,
  },

  kpiRow: {
    marginBottom: 26,
  },

  kpiCard: {
    width: 150,
    marginRight: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  kpiDanger: {
    borderColor: "#ff6b6b",
  },

  kpiTitle: {
    color: "#9aa8a6",
    fontSize: 12,
  },

  kpiValue: {
    color: "#00d48a",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 6,
  },

  kpiTrend: {
    marginTop: 6,
    color: "#7fbda4",
    fontSize: 12,
    fontWeight: "700",
  },

  aiCard: {
    backgroundColor: "rgba(0,212,138,0.08)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 30,
  },

  aiTitle: {
    color: "#00d48a",
    fontWeight: "900",
    fontSize: 16,
  },

  aiText: {
    color: "#d5efe6",
    marginTop: 8,
    lineHeight: 22,
  },

  aiBtn: {
    marginTop: 14,
    backgroundColor: "#00d48a",
    paddingVertical: 12,
    borderRadius: 14,
  },

  aiBtnText: {
    color: "#041F1A",
    textAlign: "center",
    fontWeight: "900",
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    color: "#d5efe6",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },

  chart: {
    borderRadius: 18,
  },

  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  userEmail: {
    color: "#e5fff6",
    fontWeight: "600",
  },

  userSub: {
    color: "#9aa8a6",
    fontSize: 12,
    marginTop: 2,
  },

  critical: {
    color: "#ff6b6b",
    fontWeight: "900",
  },
  safeBox: {
    backgroundColor: "rgba(0,212,138,0.08)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,212,138,0.25)",
  },

  safeIcon: {
    fontSize: 26,
    marginBottom: 6,
  },

  safeTitle: {
    color: "#00d48a",
    fontWeight: "900",
    fontSize: 15,
  },

  safeSub: {
    marginTop: 4,
    color: "#9aa8a6",
    fontSize: 12,
    textAlign: "center",
  },
});