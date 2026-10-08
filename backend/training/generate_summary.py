import csv
import json
import math

with open("data/z_alizadeh_sani.csv", "r", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

n_total = len(rows)
cad_count = sum(1 for r in rows if r["Cath"] == "CAD")
normal_count = n_total - cad_count

males = sum(1 for r in rows if r["Sex"] == "Male")
females = sum(1 for r in rows if r["Sex"] == "Female")

lad_sten = sum(1 for r in rows if r["LAD"] == "Stenotic")
lcx_sten = sum(1 for r in rows if r["LCX"] == "Stenotic")
rca_sten = sum(1 for r in rows if r["RCA"] == "Stenotic")

# Age distribution
age_bins = {"30-39": 0, "40-49": 0, "50-59": 0, "60-69": 0, "70-79": 0, "80+": 0}
for r in rows:
    a = int(r["Age"])
    if a < 40: age_bins["30-39"] += 1
    elif a < 50: age_bins["40-49"] += 1
    elif a < 60: age_bins["50-59"] += 1
    elif a < 70: age_bins["60-69"] += 1
    elif a < 80: age_bins["70-79"] += 1
    else: age_bins["80+"] += 1

# Key continuous variables by CAD status (means and stds)
def stats_by_group(feat):
    cad_vals = [float(r[feat]) for r in rows if r["Cath"] == "CAD"]
    norm_vals = [float(r[feat]) for r in rows if r["Cath"] == "Normal"]
    def get_summary(arr):
        arr.sort()
        m = sum(arr) / len(arr)
        q1 = arr[len(arr) // 4]
        med = arr[len(arr) // 2]
        q3 = arr[(len(arr) * 3) // 4]
        return {"mean": round(m, 1), "q1": round(q1, 1), "median": round(med, 1), "q3": round(q3, 1), "min": round(min(arr), 1), "max": round(max(arr), 1)}
    return {"CAD": get_summary(cad_vals), "Normal": get_summary(norm_vals)}

key_vars = ["Age", "BP", "FBS", "CR", "TG", "LDL", "HDL", "EF-TTE", "Region RWMA"]
distributions = {v: stats_by_group(v) for v in key_vars}

# Correlation matrix
corr_matrix = []
for v1 in key_vars:
    vals1 = [float(r[v1]) for r in rows]
    m1 = sum(vals1) / len(vals1)
    s1 = math.sqrt(sum((x - m1)**2 for x in vals1))
    row_corr = {"feature": v1}
    for v2 in key_vars:
        vals2 = [float(r[v2]) for r in rows]
        m2 = sum(vals2) / len(vals2)
        s2 = math.sqrt(sum((x - m2)**2 for x in vals2))
        cov = sum((vals1[i] - m1) * (vals2[i] - m2) for i in range(len(rows)))
        r_val = cov / (s1 * s2) if (s1 * s2) > 0 else 0
        row_corr[v2] = round(r_val, 2)
    corr_matrix.append(row_corr)

summary = {
    "total_records": n_total,
    "cad_positive": cad_count,
    "cad_negative": normal_count,
    "cad_prevalence": round(cad_count / n_total, 3),
    "sex_distribution": {"Male": males, "Female": females},
    "vessel_stenosis": {
        "LAD": {"count": lad_sten, "rate": round(lad_sten / n_total, 3)},
        "LCX": {"count": lcx_sten, "rate": round(lcx_sten / n_total, 3)},
        "RCA": {"count": rca_sten, "rate": round(rca_sten / n_total, 3)}
    },
    "age_bins": [{"bin": k, "count": v} for k, v in age_bins.items()],
    "distributions": distributions,
    "correlations": corr_matrix,
    "sample_records": rows[:15]
}

with open("model_artifacts/dataset_summary.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print("Dataset summary saved successfully!")
