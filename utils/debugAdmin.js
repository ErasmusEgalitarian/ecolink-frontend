import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Script de Debug - Verificar Admin Status
 *
 * Cole este código no console do app ou crie um botão temporário
 * para executar esta função.
 */

export const debugAdminStatus = async () => {
  console.log("\n========================================");
  console.log("🔍 DEBUG: Verificando Status de Admin");
  console.log("========================================\n");

  try {
    // 1. Verificar todos os dados no AsyncStorage
    console.log("1️⃣ Dados no AsyncStorage:");
    const userId = await AsyncStorage.getItem("userId");
    const authToken = await AsyncStorage.getItem("authToken");
    const userRole = await AsyncStorage.getItem("userRole");

    console.log("   - userId:", userId);
    console.log(
      "   - authToken:",
      authToken ? authToken.substring(0, 20) + "..." : "NULL",
    );
    console.log("   - userRole:", userRole);

    // 2. Verificar tipo e valor exato
    console.log("\n2️⃣ Análise do userRole:");
    console.log("   - Tipo:", typeof userRole);
    console.log("   - Valor exato:", JSON.stringify(userRole));
    console.log("   - Length:", userRole?.length);
    console.log("   - É null?", userRole === null);
    console.log("   - É undefined?", userRole === undefined);

    // 3. Comparações
    console.log("\n3️⃣ Comparações:");
    console.log('   - userRole === "Admin":', userRole === "Admin");
    console.log('   - userRole === "admin":', userRole === "admin");
    console.log('   - userRole === "ADMIN":', userRole === "ADMIN");
    console.log(
      '   - userRole.toLowerCase() === "admin":',
      userRole?.toLowerCase() === "admin",
    );

    // 4. Verificar todas as chaves do AsyncStorage
    console.log("\n4️⃣ Todas as chaves no AsyncStorage:");
    const allKeys = await AsyncStorage.getAllKeys();
    console.log("   Keys:", allKeys);

    // 5. Resultado final
    console.log("\n5️⃣ Resultado:");
    const isAdmin = userRole === "Admin";
    console.log(
      isAdmin ? "   ✅ Usuário É Admin" : "   ❌ Usuário NÃO é Admin",
    );

    // 6. Recomendações
    console.log("\n6️⃣ Recomendações:");
    if (!userRole) {
      console.log("   ⚠️  userRole está vazio!");
      console.log("   → Faça logout e login novamente");
      console.log("   → Verifique se o backend retorna user.roleId.name");
    } else if (userRole !== "Admin" && userRole?.toLowerCase() === "admin") {
      console.log("   ⚠️  userRole está em formato diferente:", userRole);
      console.log(
        '   → Ajuste o backend para retornar "Admin" (primeira letra maiúscula)',
      );
      console.log("   → OU ajuste o frontend para comparação case-insensitive");
    } else if (userRole === "Admin") {
      console.log("   ✅ userRole está correto!");
      console.log(
        "   → Se a aba não aparece, verifique o código do OverviewScreen",
      );
    } else {
      console.log("   ℹ️  userRole atual:", userRole);
      console.log("   → Este usuário não é Admin");
    }

    console.log("\n========================================\n");

    return {
      userId,
      userRole,
      isAdmin,
    };
  } catch (error) {
    console.error("❌ Erro ao debugar:", error);
    return null;
  }
};

/**
 * Função para forçar atualização do role (apenas para testes)
 */
export const forceSetAdminRole = async () => {
  console.log("⚠️  ATENÇÃO: Forçando role para Admin (apenas para teste)");
  await AsyncStorage.setItem("userRole", "Admin");
  console.log('✅ Role definido como "Admin"');
  console.log("🔄 Faça logout e login novamente para aplicar");
};

/**
 * Função para limpar AsyncStorage
 */
export const clearAsyncStorage = async () => {
  console.log("🗑️  Limpando AsyncStorage...");
  await AsyncStorage.clear();
  console.log("✅ AsyncStorage limpo. Faça login novamente.");
};

// Exportar para uso no console
if (typeof window !== "undefined") {
  window.debugAdminStatus = debugAdminStatus;
  window.forceSetAdminRole = forceSetAdminRole;
  window.clearAsyncStorage = clearAsyncStorage;
}

export default {
  debugAdminStatus,
  forceSetAdminRole,
  clearAsyncStorage,
};
